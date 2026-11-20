# Making magic less prescriptive and more opt-in

Research date: 2026-11-20. Kit version: 0.2.0 (`2843d2a`).

## Summary

Magic is prescriptive in four separate ways, and each one has a different fix.
The cheapest high-impact change is a strictness setting on the session-start bootstrap (`off`, `hint`, `strict`) with a neutral `hint` text as the default.
The owner keeps today's behavior by choosing `strict`.

The research does not support deleting the bootstrap.
One published test found that a bootstrap's presence changes how often skills trigger, and that its pressure wording does not.

## How the findings were gathered

- **Repo findings** come from reading the files cited below. Each has a `file:line` reference.
- **Harness mechanisms** and **comparable kits** come from two research subagents that fetched vendor docs and GitHub pages on 2026-11-20. I did not re-fetch each page myself.
- Items the subagents could not confirm from a primary source are listed under [Gaps](#gaps).

## Where the kit forces behavior today

The forcing is layered, and the layers repeat each other.

| # | Layer | Evidence | Reaches |
| --- | --- | --- | --- |
| 1 | Hook injects the bootstrap on every startup, clear, and compact, wrapped in `<EXTREMELY_IMPORTANT>`. No off switch. | `hooks/hooks.json:5`, `hooks/session-start:49`, `lib/bootstrap-core.js:4` | Claude Code, Cursor, OpenCode, Pi |
| 2 | Bootstrap text: the 1% rule, "YOU DO NOT HAVE A CHOICE", routing "BEFORE any tool call, file read, codebase exploration, or clarifying question", and a Red Flags table that labels ordinary judgment as rationalizing. | `skills/using-magic/SKILL.md:15`, `:17`, `:24`, `:44` | Same as layer 1 |
| 3 | The same routing table again as an always-applied rule. | `rules/workflow-routing.md:2` | Cursor plugin, `.agents` installs |
| 4 | The same routing a third time in the home instruction file. | `agents.kit.md:5-6` | `.agents` installs |
| 5 | Nearly all coding work routes to `/magic-mode`, a 24 KB skill with a "Non-negotiables" section of about 20 triggers, a playbook copied into the todo list verbatim, and a fixed reply format. | `skills/magic-mode/SKILL.md:12`, `:105`, `:129` | Any routed task |
| 6 | The reply format (1-2 sentence blocks, tables, bottom `## TL;DR`) is required in 23 files, and a test fails if any of them drops it. | `tests/output-format-skills.test.mjs:8-32` | Most workflow skills |
| 7 | Owner conventions ship to every consumer as always-applied rules: bootstrap new repos from the owner's `full-lint` repo and install magic into them, use `rg`, commit attribution, tests in separate files. | `rules/new-repo-setup.md:11`, `agents.kit.md:2-4` | Cursor plugin, `.agents` installs |
| 8 | One plugin holds all 76 skills. 69 can be invoked by the model. `install.sh` has no selection flag. | `.claude-plugin/marketplace.json:7-16`, `scripts/install.sh:23-29` | All harnesses |
| 9 | The public copy frames forcing as the feature. | `README.md:104`, `.codex-plugin/plugin.json:36` | Readers and Codex prompt suggestions |

Three more facts shape the options.

- **The forcing differs per harness.** The Claude Code manifest declares no rules, so Claude Code gets layers 1, 2, and 5 only. The Codex manifest has `"hooks": {}`, so Codex gets no bootstrap at all (`.codex-plugin/plugin.json:23`).
- **A dormant opt-in field already exists.** 71 skills carry `enabled: true`. Nothing reads it except the validator's key allowlist (`scripts/validate.sh:87`).
- **Tests pin the forcing.** A softer bootstrap must update `tests/plugin-hooks-and-manifests.test.mjs:32`, `tests/opencode-and-pi-plugins.test.mjs:16`, `tests/writing-rules.test.mjs:69`, and `tests/version-sync.test.mjs:85-98`.

## What "too prescriptive" can mean

Each meaning maps to different options, so it helps to name which ones bother you.

| Meaning | Layers | Options |
| --- | --- | --- |
| **Tone.** Pressure language and pre-emptive rebuttals. | 1, 2 | B |
| **Forced routing.** Every task goes through a heavy workflow, including small ones. | 2, 3, 4, 5 | A, C, D, E |
| **Personal taste shipped as policy.** Reply format, `full-lint`, `rg`. | 6, 7 | F, G |
| **All-or-nothing packaging.** No way to take research without proofs, or skills without rules. | 8 | H, I |

## Options

Options are ordered by impact per unit of work.

### A. Add a bootstrap strictness setting

One setting, three values, read in the two places that build the bootstrap (`hooks/session-start` and `lib/bootstrap-core.js`).

| Value | Behavior |
| --- | --- |
| `off` | Inject nothing. Skills still trigger from their descriptions and from `/name`. |
| `hint` | Inject a short neutral pointer (option B). Suggested default. |
| `strict` | Inject today's text unchanged. |

Each harness has a native place to carry the value.

| Harness | Where the user sets it | Source |
| --- | --- | --- |
| Claude Code | `userConfig` in `plugin.json`, prompted at enable and exposed to hooks as `CLAUDE_PLUGIN_OPTION_<KEY>` | [plugins reference](https://code.claude.com/docs/en/plugins-reference) |
| Cursor | Environment variable read by the hook. Plugin `variables` reach `mcp.json` only. | [plugins reference](https://cursor.com/docs/reference/plugins) |
| OpenCode | `"plugins": [{"package": "magic", "options": {...}}]`, read as `ctx.options` | [plugins](https://opencode.ai/docs/plugins/) |
| Pi | `pi.registerFlag`, or the user drops the extension with a package filter | [extensions](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/extensions.md) |
| Codex | Nothing to do. There is no hook. | `.codex-plugin/plugin.json:23` |

An environment variable such as `MAGIC_BOOTSTRAP` works as a common fallback on every hook-based harness.

Users of the upstream bootstrap keep asking for exactly this.
Superpowers issues [#938](https://github.com/obra/superpowers/issues/938), [#2509](https://github.com/obra/superpowers/issues/2509), and [#2666](https://github.com/obra/superpowers/issues/2666) all request an injection off switch, and the maintainer's answer for the first two was to disable the whole plugin.

### B. Rewrite the default bootstrap as a neutral pointer

Replace the wrapper, the 1% rule, and the Red Flags table with about 15 lines that say what is available, when each entry skill tends to help, that small tasks can be done directly, and that user instructions win.

- **Vendor guidance.** Anthropic's prompting guide says newer models "may now overtrigger" on aggressive language and recommends plain "Use this tool when..." phrasing. It also warns that "If in doubt, use [tool]" causes overtriggering, which is what the 1% rule says. [Source](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices).
- **Measured, with caveats.** A user test in superpowers [#2377](https://github.com/obra/superpowers/issues/2377) compared the pressure bootstrap, a neutral rewrite, and no bootstrap. Both bootstraps routed 15 of 15. This is one commenter's single-turn test, not a controlled study.
- **Upstream moved the same way.** Superpowers kept its pressure text but added "Ceremony now scales to the task" and a skip offer in v6.3.0 and v7.0.0. [Release notes](https://github.com/obra/superpowers/blob/main/RELEASE-NOTES.md).
- **Injection safety.** Claude Code's hooks page advises writing injected context as factual statements, because command-style framing can trip prompt-injection defences. [Source](https://code.claude.com/docs/en/hooks).

### C. Remove the duplicate forcing channels

Keep one routing source and delete the echoes.

- Change `rules/workflow-routing.md` from `alwaysApply: true` to description-triggered, or delete it. Cursor users can already retune a plugin rule to "Agent Decides" or "Manual". [Source](https://cursor.com/docs/plugins).
- Remove the two routing bullets from `agents.kit.md:5-6`.

### D. Split skills by who invokes them

Make the heavy orchestrators user-invoked only, and leave small discipline skills to trigger from their descriptions.

- **Mechanism.** `disable-model-invocation: true` works on Claude Code, Cursor, OpenCode, and Pi. Codex uses `policy: {allow_implicit_invocation: false}` in `agents/openai.yaml`. Sources: [Claude Code skills](https://code.claude.com/docs/en/skills), [Cursor skills](https://cursor.com/docs/context/skills), [OpenCode skills](https://opencode.ai/docs/skills/), [Pi skills](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/skills.md), [Codex skills](https://learn.chatgpt.com/docs/build-skills).
- **Current state.** Seven skills set the flag today. Candidates to add are the ones that spawn many agents or run for a long time: `autopilot`, `arena`, `swarm`, `figure-it-out`, `subagent-driven-development`, and the two `create-*-verification-skill` generators.
- **Precedent.** `mattpocock/skills` splits user-invoked orchestrators from model-invoked discipline skills. [Source](https://github.com/mattpocock/skills).
- **Side benefit.** On Claude Code a user-only skill's description leaves the context. The listing budget is 1% of the context window and the least-used descriptions are dropped first. The kit's descriptions total about 15.7 KB, which by my arithmetic exceeds that budget on a 200K-token window (about 8,000 characters at 4 characters per token). That figure is an estimate, not a measurement.

### E. Let `/magic-mode` scale to the task

Routing is only as heavy as the skill it routes to.

- Rename "Non-negotiables" to defaults and add a size exit at the top. A one-line fix should not open a playbook todo list.
- Apply the verbatim playbook copy (`skills/magic-mode/SKILL.md:129`) only when a playbook matches non-trivial work.
- Consider making `/magic-mode` a mode the user turns on for a session, the way SuperClaude treats explicit flags as outranking auto-detection. [Source](https://github.com/SuperClaude-Org/SuperClaude_Framework/blob/master/docs/user-guide/flags.md).
- BMAD sizes its entry point the same way: "Small changes go straight to build". [Source](https://github.com/bmad-code-org/BMAD-METHOD).

### F. Move the reply format into one opt-in style

The format is taste, and it is currently copied into 23 files.

- Keep it in one place, for example a `magic-reply-style` skill or a setting next to the strictness value.
- Change the 23 files to reference it conditionally.
- Replace the assertion in `tests/output-format-skills.test.mjs` with one that checks the single source.

### G. Separate the owner's conventions from the kit

Two things are mixed today: a reusable kit and the owner's home setup.

- `rules/new-repo-setup.md` tells every consumer's agent to bootstrap from the owner's `full-lint` repo and to install magic into each new repository. That makes the kit spread itself.
- `agents.kit.md:2-4` sets `rg`, commit attribution, and test file placement for everyone.
- Move these into an `owner` or `personal` profile that is not installed by default.
- `CONTEXT.md:3` describes the kit as the owner's "public agent setup". A profile keeps that true for the owner without making it true for everyone else.

### H. Package as a small core plus opt-in bundles

This is the largest change and the one comparable kits lean on most.

| Harness | Mechanism | Source |
| --- | --- | --- |
| Claude Code | Several `plugins[]` entries with `source` subdirectories. A bundle plugin can be just `name` plus `dependencies`. | [marketplace reference](https://code.claude.com/docs/en/plugins/marketplace-reference), [dependencies](https://code.claude.com/docs/en/plugins/dependencies) |
| Cursor | `plugins[]` in `.cursor-plugin/marketplace.json` | [plugins reference](https://cursor.com/docs/reference/plugins) |
| Codex | `plugins[]` in `.agents/plugins/marketplace.json` with an install policy per plugin | [build plugins](https://developers.openai.com/codex/plugins/build) |
| Pi | Users filter a package's skills and extensions in settings without forking | [packages](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/packages.md) |
| OpenCode | No marketplace. Separate packages, or per-skill `permissions` deny rules. | [permissions](https://opencode.ai/docs/permissions/) |
| `.agents` install | Add `--only <bundle>` or `--profile <name>` to `scripts/install.sh` | `scripts/install.sh:23-29` |

A plausible cut is `core` (help, research, how, why), `mode` (magic-mode, playbooks, principles, `magic-agent`), `proofs`, `writing`, `pr`, and `owner-rules`.

- **Precedent.** spec-kit ships a core plus `specify extension add`. `wshobson/agents` ships 93 plugins. `vercel-labs/skills` installs per skill. Sources: [spec-kit](https://github.com/github/spec-kit), [wshobson/agents](https://github.com/wshobson/agents), [vercel-labs/skills](https://github.com/vercel-labs/skills).
- **Cost.** Skills link to each other by relative path (`../<name>/SKILL.md`), and `scripts/validate.sh` checks those links. Links that cross a bundle boundary need a new convention.

### I. Use or delete the `enabled` field

71 skills carry `enabled: true` and nothing acts on it.

- **Use it.** The installer, the OpenCode loader (`.opencode/plugins/magic.js:136-150`), and a user override file honor it. This gives per-skill opt-in on the harnesses that lack a native one.
- **Delete it.** A field that looks like a switch and does nothing misleads readers.

## What other kits do

Of the ten kits surveyed, superpowers is the only one with a forced-routing bootstrap.

| Kit | Activation | Packaging | Strictness control |
| --- | --- | --- | --- |
| [obra/superpowers](https://github.com/obra/superpowers) | Forced bootstrap at session start | One plugin | None. Disable the plugin. |
| [anthropics/skills](https://github.com/anthropics/skills) | Description-triggered or by mention | Two plugins | None |
| [mattpocock/skills](https://github.com/mattpocock/skills) | User-invoked orchestrators, model-invoked discipline skills | One plugin, per-skill install | Per-repo setup skill |
| [wshobson/agents](https://github.com/wshobson/agents) | Namespaced commands and description-triggered skills | 93 plugins | Model tiers only |
| [SuperClaude](https://github.com/SuperClaude-Org/SuperClaude_Framework) | `/sc:` commands and flags | Monolith | Flags. User flags outrank auto-detection. |
| [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | Explicit named skills | Modules | Entry point sized to the work |
| [github/spec-kit](https://github.com/github/spec-kit) | Explicit `/speckit-*` commands | Core plus extensions | Presets and project overrides |
| [compound-engineering](https://github.com/EveryInc/compound-engineering-plugin) | Explicit `/ce-*` commands | One plugin | Setup skill writes a config file |
| [vercel-labs/skills](https://github.com/vercel-labs/skills) | Installer only | Per skill | Not applicable |
| [garrytan/gstack](https://github.com/garrytan/gstack) | Explicit slash commands | Monolith | `gstack-config set ... off` |

## Why not remove the bootstrap entirely

Description-only triggering is uneven across models, so `off` is a poor default.

- The #2377 test with no bootstrap routed 15 of 15 on one model, 11 of 15 on another, and 6 of 15 on a third.
- Vercel reported a skill was never invoked in 56% of eval cases. [Source](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals).
- Superpowers removed its Codex hook because "Codex reliably triggers skills on its own", and kept it elsewhere. [Release notes](https://github.com/obra/superpowers/blob/main/RELEASE-NOTES.md).

## Suggested order

| Phase | Options | Size | Reversible |
| --- | --- | --- | --- |
| 1 | A, B, C, plus the README and Codex prompt wording | Small. Two bootstrap builders, one skill, one rule, four tests. | Yes. `strict` restores today's behavior. |
| 2 | D, E, F, G | Medium. Frontmatter edits, one skill restructure, 23 files for the reply format. | Yes |
| 3 | H, I | Large. Manifests, installer, link convention, validator. | Harder. Consumers reinstall. |

Run the kit's own Eval playbook before and after phase 1.
Measure two rates: how often a skill triggers when it should, and how often one triggers on a trivial request.

## Open decisions

- **Default strictness.** `hint` is the suggestion. `off` is the most opt-in and risks skills not triggering on some models.
- **Kit or home setup.** Option G depends on whether magic is a product for others or the owner's published `~/.agents`.
- **Reply format.** Option F depends on whether the format is part of magic's identity or a preference.

## Gaps

- Superpowers issues #2487 and #2666 are closed as completed, and the shipped change was not confirmed.
- Whether several Pi packages can come from one git repository is unconfirmed.
- Cursor documents no per-skill or per-hook off switch. It may exist undocumented.
- The Cursor and OpenCode findings came through a summarizing fetch, so key names there carry medium confidence.
- "No session-start injection" for the comparable kits means their READMEs are silent. Their hook configs were not read.
- The listing-budget overflow in option D is arithmetic. `claude plugin details magic` would show the real always-on token count.

## Side finding

`skills/research/SKILL.md` names subagent types such as `researcher-mid`.
On a Claude Code plugin install they register as `magic:researcher-mid:researcher-mid`, so the first dispatch in this session failed until the full name was used.
