# Naming Governance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use the `subagent-driven-development` skill (recommended) or run the tasks yourself in order to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a naming lane to the kit that verifies the names a diff adds with a fresh reviewer, and governs naming while code is written if a baseline shows agents need it.

**Architecture:** The lane copies the comments lane. A `check-names` skill spawns a report-only `name-critic` agent that reads a rubric and the project glossary, and the skill applies the renames it accepts. A `principle-name-things-honestly` skill joins the `magic-mode` Principles index only if a baseline run shows agents name badly without it.

**Tech Stack:** Markdown skills and agents, `scripts/validate.sh` (bash and Python), Node test runner, Python `unittest`, `markdownlint-cli2` 0.23.2, `typos` 1.50.1.

**Spec:** `docs/research/naming-governance.md`. This path is gitignored, so the file exists only where it was written or attached. The executor needs it for Task 2, which copies tables from its Part 1.

## Decisions taken

The spec left ten questions open. This plan answers them as follows. Change any row before execution starts.

| Question | Decision | Reason |
| --- | --- | --- |
| Names | Skill `check-names`, agent `name-critic`, principle `principle-name-things-honestly` | Verb-first skill name per `skills/writing-skills/references/discovery.md:120-124`; imperative principle title like its siblings |
| Named agent or prompt file | Named agent in `agents/` | Mirrors `no-comments` and `comment-sicko`, the lane the spec recommends copying |
| Trigger | Before review, beside `no-comments`, on any diff that adds or renames a name | The goal is that every new name is verified |
| Authority | The agent reports only. The skill applies accepted renames. | Same split as the comments lane |
| Scope | Only names the diff adds or renames | Keeps the diff inside the `autopilot` budget and inside `skills/clean-code/SKILL.md:12` |
| Rename commits | Not needed | Every rename targets a name that is not yet on the base branch |
| Seed | Reuse the Reader Test, false-reading test, and frozen-names rule from the deleted `agents/pr-naming/agent.md` (`git show a553770:agents/pr-naming/agent.md`) | Owner-authored, so no third-party notice |
| Language references | None. Casing and prefixes defer to the project's linter and the surrounding file. | ADR-0002 |
| Glossary writes | Read-only | The glossary flow belongs to the separately installed domain-modeling skill |
| Reach | Code, tests, files, modules, config keys, flags. Not branches, commits, or doc headings. | No source in the spec treats those as naming discipline |

Out of scope: a script that checks a diff against glossary `_Avoid_` lists, per-language naming lint, and the other dangling references in `skills/autopilot/SKILL.md:83-84`.

## Global Constraints

- **Suite.** Every task that changes the repo ends with all five commands green:

  ```bash
  ./scripts/validate.sh
  node --test tests/*.test.mjs
  python3 -m unittest discover -s tests
  npx --yes markdownlint-cli2@0.23.2 "**/*.md"
  pip install --quiet --target /tmp/typos-pkg typos==1.50.1 && /tmp/typos-pkg/bin/typos
  ```

- **No model pins.** No `model` field and no vendor model slug in any new file (ADR-0001).
- **No language rules.** New kit text states no casing, prefix, or per-language convention (ADR-0002).
- **Harness neutrality.** Use the neutral terms in `skills/magic-mode/references/harness-adapter.md`. Every agent spawn carries the inline fallback sentence from `skills/no-comments/SKILL.md:20`.
- **No wording tests.** Add no test or validator check that asserts on Markdown wording (`agents.md:28-29`). Only existing count literals change.
- **Slash references.** In `skills/`, `agents/`, and `rules/`, a slash followed by a lowercase word must be a known skill (`scripts/validate.sh:119`). Write slashes between backticked words or between letters, never after a space.
- **Frontmatter.** Keys sorted alphabetically. A skill's `id` and `name` equal its directory. A skill description starts with "Use when" and lists triggers only; a principle description starts with "Apply when".
- **Prose.** Run the `unslop` skill on every new prose file. No long dash. No colon as a mid-sentence connector.
- **Ported files.** Wording edits to files ported from pstack (`skills/magic-mode/**`, `skills/magic-help/`, `docs/magic-guide/`) go in their own commit, separate from new files (ADR-0008).
- **Not touched.** `skills/thermo-nuclear-code-quality-review/`, `skills/writing-skills/`, `skills/writing-plans/`, `skills/subagent-driven-development/`, `skills-disabled/`, `.skill-lock.json`, `.version-bump.json`, `CHANGELOG.md`, `using-magic`, `rules/`, `agents.kit.md`.
- **Line numbers.** Every `path:line` here refers to commit `b08f8a9`. Earlier steps insert lines, so locate each edit by its quoted text.
- **Branch.** Commit on `phillip/vigilant-pasteur-kefcbf`. Open a pull request only when the owner asks.
- **Local artifacts.** The fixture repository and the run notes stay out of the repo. Notes go in `docs/research/naming-baseline.md`, which is gitignored.

## Review Focus

Each line names a condition the spec implies and the task whose test pins it.

1. **A diff with no new names** (prose only, or deletions only). The skill reports "no new names" and spawns no reviewer. Pinned in Task 3, step 5.
2. **A project with no `CONTEXT.md`.** The reviewer proceeds without glossary findings and without an error. Pinned in Task 3, step 6.
3. **A harness with no named agent types.** A general-purpose subagent with `agents/name-critic/agent.md` inlined meets the same criteria. Pinned in Task 3, step 7.
4. **A renamed symbol used in strings, docs, or tests.** After the skill applies renames, the old name appears nowhere. Pinned in Task 3, step 8.
5. **Generated or vendored files in the diff.** Names there get no findings and appear under Skipped. Pinned by control I in Task 1 and criterion G4 in Task 3.

---

### Task 1: Seeded fixture and RED baseline

This task changes nothing in the kit. It builds the test the reviewer must pass and records how a reviewer with no definition does.

**Files:**

- Create (outside the repo): git repository at `/tmp/orders-service`
- Create (local, gitignored): `docs/research/naming-baseline.md`

**Interfaces:**

- Produces: branch `add-fulfillment` and branch `update-readme` in `/tmp/orders-service`, both cut from `main`. Later tasks run against them by name.
- Produces: criteria G1 to G7 below, which Task 3 reuses unchanged.

- [ ] **Step 1: Create the base commit on `main`**

Use project-shaped names only. No file, directory, or comment may contain "eval", "test fixture", "planted", "seeded", or "rubric".

| File | Content |
| --- | --- |
| `README.md` | Two sentences describing an order fulfillment service |
| `CONTEXT.md` | A `## Language` section with **Customer** ("A person or company that places orders. _Avoid_: client, account, user") and **Order** ("A confirmed request for goods. _Avoid_: purchase, cart") |
| `orders/__init__.py` | Empty |
| `orders/fulfillment.py` | `calculate_total(order) -> Decimal`; `get_customer(customer_id)` as a pure lookup; a module-level dict named `helper_data`; `parse_carrier_payload(payload) -> str` returning `payload["usr_nm"]` |

- [ ] **Step 2: Create branch `add-fulfillment` with one commit**

Add these to `orders/fulfillment.py`, each with a real body of 3 to 12 lines that does what the table says.

| # | Name | What the code does | Expected |
| --- | --- | --- | --- |
| 1 | `get_order(order_id)` | Returns the order; inserts and returns a new empty order when none exists | `blocker` |
| 2 | `is_valid(order) -> int` | Returns the number of validation errors | `blocker` |
| 3 | `order_list` | A dict of orders keyed by order id | `blocker` |
| 4 | `validate_address(address) -> None` | Strips whitespace from the fields; never raises | `blocker` |
| 5 | `client_email` | A parameter holding the customer's email | `blocker` |
| 6 | `save_order(order)` | Persists the order and sends a confirmation email | flagged |
| 7 | `process_data(data)` | Applies a loyalty discount to an order and returns it | flagged |
| 8 | `calculate_total_v2(order)` | Like `calculate_total` but skips the tax lookup for orders under 5 lines; `calculate_total` stays | flagged |
| 9 | `carrier_timeout = 30` | A plain integer passed to a call that takes seconds | flagged |
| 10 | `disable_notifications: bool = False` | A parameter; the body tests `if not disable_notifications` | flagged |

Add these controls in the same commit. None may be flagged.

| # | Name | What the code does |
| --- | --- | --- |
| A | `i` | Index of a three-line `for` loop |
| B | `orders_by_customer_id` | A dict of order lists keyed by customer id |
| C | `retry_delay_seconds = 5` | A plain integer passed to a call that takes seconds |
| D | `is_shippable(order) -> bool` | A pure predicate |
| E | `class OrderPlaced` | An event dataclass |
| F | `helper_data` | The existing module-level dict, read by new code but not introduced by the diff |
| G | `payload["acct_ref"]` | A carrier payload key read by new code. Allowed outcome: no finding, or a finding marked `frozen`. |
| H | `shipping_cost(order) -> Decimal` | A pure query with a noun-phrase name |
| I | `orders/generated/carrier_client.py` | A new file whose first line is `# Generated by carrier-codegen. DO NOT EDIT.`, containing `def GetShpmntStsV2(req)` and a local `tmpObj` |

- [ ] **Step 3: Create branch `update-readme` from `main`**

One commit that rewrites the two sentences in `README.md`. No other file changes.

- [ ] **Step 4: Run the RED baseline three times**

Spawn a fresh general-purpose subagent for each run, with exactly this brief and nothing else:

```text
In /tmp/orders-service, review the names that branch add-fulfillment adds compared with main. Tell me which ones should change and what to call them. Do not edit files.
```

- [ ] **Step 5: Score each run against the criteria and record it**

| Criterion | Passes when |
| --- | --- |
| G1 | Items 1 to 4 are each reported as the most severe kind the report has. For `name-critic` that kind is `blocker`. |
| G2 | Item 5 is reported and the reason cites the glossary. For `name-critic` it is a `blocker`. |
| G3 | At least 4 of items 6 to 10 are reported |
| G4 | None of controls A to E, H, or I is reported |
| G5 | Control F is not reported |
| G6 | No rename is proposed for `acct_ref` or `usr_nm` |
| G7 | The report follows the format in Task 2 (not applicable to the baseline) |

Write a table to `docs/research/naming-baseline.md` with one row per run and one column per criterion, plus the raw reports.

- [ ] **Step 6: Apply the gate**

If all three baseline runs pass G1 to G6, stop and report to the owner. A reviewer that already behaves correctly needs no definition, per `skills/writing-skills/SKILL.md:166`. Otherwise continue, and list which criteria failed, because Task 2's agent text must address those failures by name.

---

### Task 2: The reviewer agent, the skill, the rubric, and registration

**Files:**

- Create: `agents/name-critic/agent.md`
- Create: `skills/check-names/SKILL.md`
- Create: `skills/check-names/references/rubric.md`
- Create: `docs/adr/0009-naming-verified-by-fresh-reviewer.md`
- Modify: `scripts/validate.sh:112-115`
- Modify: `skills/magic-mode/references/harness-adapter.md:13`
- Modify: `docs/CATALOG.md:3,37,82,127,132`
- Modify: `README.md:137`
- Test: `tests/version-sync.test.mjs:152-158`, `tests/opencode-and-pi-plugins.test.mjs:147,157,181`

**Interfaces:**

- Consumes: the failed criteria from Task 1, step 6.
- Produces: the `name-critic` report format below. `check-names` parses it, and Task 3 scores it as G7.

```markdown
## Findings

| Severity | Name | Where | Why it fails | Proposed name |
| --- | --- | --- | --- | --- |

## Checked

<count> names in <count> files.

## Skipped

- <path or name>: <reason>
```

- `Severity` is `blocker` or `suggestion`.
- `Where` is `path:line`.
- `Why it fails` cites one rule id from the rubric, such as `R1`.
- `Proposed name` is a name, or `reshape` when no honest short name exists, or `frozen` when the name is an external contract.
- With no findings, the table is replaced by the line `No findings.`

- [ ] **Step 1: Update the count literals in the tests**

In `tests/version-sync.test.mjs:152-158`, change `76` to `77` and `51` to `52` in the test title and the three patterns. In `tests/opencode-and-pi-plugins.test.mjs:147,157,181`, change `76` to `77`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test tests/*.test.mjs`
Expected: 2 failures. One reports that `README.md` does not match `77 active skills`. One reports `expected 77 skills in skills/*/SKILL.md`.

- [ ] **Step 3: Add `name-critic` to the validator's agent list**

In `scripts/validate.sh:112-115`, extend the `AGENT_REF` alternation with `|name-critic` after `comment-sicko`.

- [ ] **Step 4: Write `skills/check-names/SKILL.md`**

Frontmatter, exactly:

```yaml
---
description: "Use when a diff adds or renames identifiers, files, modules, tests, config keys, or flags and is about to go to review, or when asked to check, audit, or fix names."
enabled: true
id: check-names
name: check-names
---
```

Body, shaped like `skills/no-comments/SKILL.md`, 300 words or fewer. It must state each of these and nothing else:

- **Scope.** The caller's files or diff. Otherwise the current diff against the base branch, default `main`, including the working tree. Only names the diff adds or renames.
- **Skip.** When the diff adds or renames no identifier, file, or key, report "no new names" and stop without spawning a reviewer.
- **Step 1.** Spawn a `name-critic` subagent, with the inline fallback sentence from `skills/no-comments/SKILL.md:20` adapted to `agents/name-critic/agent.md`. Pass the scope, the absolute path of `references/rubric.md`, and the path of the repo-root `CONTEXT.md` and `CONTEXT-MAP.md` when they exist. Pick the reasoning level per the Subagents section of the **magic-mode** skill.
- **Step 2.** Inspect the report against the code. Reject a finding on a name the diff did not add, a finding with no rule id, a finding whose reason is false when you read the body, and any rename of a `frozen` name. Rerun once with the failure named when a report breaks scope or format. Report a second failure open.
- **Step 3.** Apply every accepted `blocker`. Apply an accepted `suggestion` when every use of the name is inside the diff. Rename every use in code, strings, docs, and tests, and search the old name to zero. Keep the casing the surrounding file uses.
- **Step 4.** Never rename for a `reshape` finding. Report it open and name the **architect** skill as the next step.
- **Step 5.** Run the project's narrowest checks that cover the renamed symbols.
- **Step 6.** Report a table of findings with accepted, rejected, applied, and open columns, then a `## TL;DR`.

- [ ] **Step 5: Run the validator to verify it fails**

Run: `./scripts/validate.sh`
Expected: `FAIL skills/check-names/SKILL.md: references unknown agent 'name-critic'`

- [ ] **Step 6: Write `agents/name-critic/agent.md`**

Frontmatter, exactly:

```yaml
---
connection-type: internal
description: A fresh-eyes reviewer that reports names that lie or leave a reader guessing, and never edits code.
enabled: true
id: name-critic
name: name-critic
readonly: true
role: delegation-target
---
```

Body, 350 words or fewer. It must state each of these:

- **Input.** The scoped files or diff, the rubric path, and the glossary path when given. With no scope, the current diff against `main`.
- **Read the rubric first,** in full, before reading any name.
- **Body first.** For each function, type, or module the diff adds, read the body and write one line on what it does, returns, and changes. Only then compare that line with the name.
- **Reader Test.** A competent engineer who sees only the name at its call site must form the right idea of what the thing is and what it does. If that needs the body, the name fails.
- **False-reading test.** Read each boolean with the value false. The sentence must describe real behaviour.
- **Threshold.** Report only clear failures that cite a rule id. A name you would merely have chosen differently is not a finding.
- **Scope.** Only names the diff adds or renames. An existing name is evidence for consistency and never a finding.
- **Skips.** Generated and vendored files, and names fixed by an external contract. List each under Skipped, or mark the finding `frozen`.
- **Severity.** `blocker` when the name states something false, uses a glossary `_Avoid_` term, or reuses a term for a second meaning. `suggestion` for every other rule.
- **Reshape.** When no honest short name exists, propose `reshape` and say what the thing mixes.
- **Never edit a file.** Report only, in the exact format from this task's Interfaces block.

Address by name each criterion that failed in Task 1, step 6.

- [ ] **Step 7: Write `skills/check-names/references/rubric.md`**

Build it from the spec's Part 1. Sections in this order:

| Section | Source in the spec | Changes |
| --- | --- | --- |
| `## How to judge` | Agent tests above, plus P14 | State the three tests and the threshold once. Say that judging is about honesty and understanding, never the reviewer's preference. |
| `## Rules` | Section 1.1, P1 to P13 | Renumber as `R1` to `R13`. Columns: `Id`, `Rule`, `Tell`, `Fix`. Drop the evidence column. |
| `## By kind of thing` | Section 1.2 | Drop the Sources column and the "Branches and commits" row. |
| `## Smells` | Section 1.3, both tables | Columns: `Smell`, `Tell`, `Rule`, `Severity`. Drop the precision column. Rows that map to R1 are `blocker`; all others are `suggestion`. Drop the five rows with precision under 50%. |
| `## Glossary` | Section 1.5, "Needs a project glossary" | A bold term in `CONTEXT.md` is canonical. Its `_Avoid_` list is banned for new names. With no glossary, skip this section silently. |
| `## Frozen names` | Deleted `pr-naming` rubric | Persisted keys, wire fields, public API names, and identifiers users author against are never renamed. |
| `## Not checked here` | Section 1.7 | The list as written, with one line saying the project's linter and the surrounding file decide these, and one line saying a finding that keeps recurring belongs in a project lint through the **correct** skill. |
| `## Provenance` | Spec sources | Author and title only, as plain text. No URLs. |

- [ ] **Step 8: Write the ADR**

Create `docs/adr/0009-naming-verified-by-fresh-reviewer.md` with this content:

```markdown
# Naming is verified by a fresh reviewer, not a rule or a kit lint

The kit checks the names a diff adds with `/check-names`, which spawns the report-only `name-critic` agent over the diff with a rubric and the project's `CONTEXT.md` glossary. An always-applied naming rule was rejected because generic naming advice is a platitude the model already follows (`skills/writing-rules/SKILL.md`), and a rubric does not fit a rule's size limit. Extending `/clean-code` alone was rejected because the authoring agent would review its own names, and a model reviewer drifts toward the meaning a name suggests; a fresh context that reads the body first is the real reader test. Deterministic checks such as casing, length, and banned words stay in each project's linters (ADR-0002). The reviewer reports only clear failures against a cited rule and covers only names the diff adds, so a rename never reaches code the diff did not introduce.
```

- [ ] **Step 9: Register the agent and the skill in the docs**

- `skills/magic-mode/references/harness-adapter.md:13`: change the row label to ``A `magic-agent`, `comment-sicko`, or `name-critic` subagent``.
- `docs/CATALOG.md:3`: `76` to `77`, `51` to `52`, `7 specialist sub-agents` to `8 specialist sub-agents`.
- `docs/CATALOG.md:37`: heading `## 51` to `## 52`.
- `docs/CATALOG.md`, after line 82, add:

  ```markdown
  | **Prose & Code Hygiene** | [`/check-names`](../skills/check-names/SKILL.md) | Checking the names a diff adds before review via `name-critic` |
  ```

- `docs/CATALOG.md:127`: heading `## 7 Sub-Agents` to `## 8 Sub-Agents`.
- `docs/CATALOG.md`, after line 132, add:

  ```markdown
  | [`name-critic`](../agents/name-critic/agent.md) | Read-Only | Reports names that lie or leave a reader guessing for `/check-names` |
  ```

- `README.md:137`: `76` to `77`, `51` to `52`, `7 sub-agents` to `8 sub-agents`.

- [ ] **Step 10: Run the Suite to verify it passes**

Run: the five Suite commands.
Expected: `checked 77 skills, 8 agents, 5 rules`, `# fail 0`, `OK`, `0 issues`, and no `typos` output.

- [ ] **Step 11: Commit**

```bash
git add agents/name-critic skills/check-names docs/adr/0009-naming-verified-by-fresh-reviewer.md scripts/validate.sh skills/magic-mode/references/harness-adapter.md docs/CATALOG.md README.md tests/version-sync.test.mjs tests/opencode-and-pi-plugins.test.mjs
git commit -m "feat(check-names): add a fresh-reviewer naming pass with a rubric"
```

---

### Task 3: GREEN runs on the fixture

**Files:**

- Modify (only if a run fails): `agents/name-critic/agent.md`, `skills/check-names/references/rubric.md`, `skills/check-names/SKILL.md`
- Append (local): `docs/research/naming-baseline.md`

**Interfaces:**

- Consumes: branches `add-fulfillment` and `update-readme` and criteria G1 to G7 from Task 1; the report format from Task 2.

- [ ] **Step 1: Run `name-critic` three times on `add-fulfillment`**

Spawn a fresh `name-critic` subagent for each run. Pass the scope "the diff of `add-fulfillment` against `main` in `/tmp/orders-service`", the absolute path of `skills/check-names/references/rubric.md`, and `/tmp/orders-service/CONTEXT.md`.

- [ ] **Step 2: Score each run against G1 to G7**

Expected: every run passes every criterion. Append the table and raw reports to `docs/research/naming-baseline.md` beside the RED rows.

- [ ] **Step 3: Close each failure and rerun**

For each failed criterion, change the one sentence in `agent.md` or the one rubric row that governs it. Rerun all three runs. Stop after two revision rounds and report to the owner if any criterion still fails.

- [ ] **Step 4: Confirm the reviewer left the fixture unchanged**

Run: `git -C /tmp/orders-service status --porcelain`
Expected: no output.

- [ ] **Step 5: Run the `check-names` skill on `update-readme`**

Expected: the reply says "no new names" and no subagent was spawned.

- [ ] **Step 6: Run `name-critic` once with the glossary removed**

In a copy of the fixture, delete `CONTEXT.md` from both branches. Run as in step 1 without a glossary path.
Expected: G1, G3, G4, G5, G6, and G7 pass. Item 5 may go unreported. The report contains no error and no mention of a missing glossary.

- [ ] **Step 7: Run the inline fallback once**

Spawn a general-purpose subagent whose brief is the body of `agents/name-critic/agent.md` followed by the step 1 inputs.
Expected: G1 to G7 pass.

- [ ] **Step 8: Run the full `check-names` skill on `add-fulfillment` in a copy of the fixture**

Expected, checked from the copy:

```bash
git -C /tmp/orders-service-apply grep -n -w -e get_order -e is_valid -e order_list -e client_email -e validate_address
python3 -m py_compile /tmp/orders-service-apply/orders/fulfillment.py
git -C /tmp/orders-service-apply diff --quiet add-fulfillment -- orders/generated
```

The first command prints nothing, except for a name the report marked `reshape`. The second and third exit 0. `helper_data`, `acct_ref`, and `usr_nm` still appear in `orders/fulfillment.py`.

- [ ] **Step 9: Run the Suite and commit any revisions**

Run: the five Suite commands. Expected: all green.

```bash
git add agents/name-critic skills/check-names
git commit -m "fix(check-names): close the gaps the fixture runs found"
```

Skip the commit when steps 1 to 8 passed with no revision.

---

### Task 4: Wire the pass into review points and docs

Every edit here changes wording in a ported or shared file, so this task is one commit of its own.

**Files:**

- Modify: `skills/magic-mode/SKILL.md:29`
- Modify: `skills/magic-mode/playbooks/opening-a-pr.md:9,32`
- Modify: `skills/magic-mode/playbooks/multi-phase-plan.md:61`
- Modify: `skills/magic-mode/playbooks/autopilot-full.md:10`
- Modify: `skills/magic-mode/playbooks/refactoring.md:11`
- Modify: `skills/clean-code/SKILL.md:27,42`
- Modify: `skills/autopilot/SKILL.md:84`
- Modify: `skills/magic-help/SKILL.md:93`
- Modify: `README.md:115`
- Modify: `docs/magic-guide/README.md:11`, `docs/magic-guide/05-build-and-clean.md:73-75`

**Interfaces:**

- Consumes: the skill id `check-names` from Task 2.

- [ ] **Step 1: Run the wording tests that bind these files, before editing**

Run: `node --test tests/magic-sync.test.mjs`
Expected: PASS. These tests require that any `multi-phase-plan.md` line naming `clean-code` or `make-pr-easy-to-review` has no long dash and no colon followed by a non-space, and that `skills/clean-code/SKILL.md` keeps the strings "Universal AI Slop Checklist" and "## TL;DR".

- [ ] **Step 2: Add the trigger to `magic-mode`**

After `skills/magic-mode/SKILL.md:29`, add:

```markdown
- Before review, on a diff that adds or renames a name → the **check-names** skill (`/check-names`).
```

- [ ] **Step 3: Add the pass to the playbooks**

| File and line | Replace | With |
| --- | --- | --- |
| `opening-a-pr.md:9` | `` `/no-comments` before review, `` | `` `/no-comments` and `/check-names` before review, `` |
| `opening-a-pr.md:32` | `` `/no-comments`, and `/make-pr-easy-to-review` `` | `` `/no-comments`, `/check-names`, and `/make-pr-easy-to-review` `` |
| `multi-phase-plan.md:61` | `` `/no-comments` before review, `` | `` `/no-comments` and `/check-names` before review, `` |
| `autopilot-full.md:10` | `` the `/no-comments` pass, and `` | `` the `/no-comments` pass, the `/check-names` pass, and `` |
| `refactoring.md:11` | `Spot-check every rename against the actual files.` | `` Spot-check every rename against the actual files, and judge each new name against `../../check-names/references/rubric.md`. `` |

- [ ] **Step 4: Add the pointer row to `clean-code`**

In `skills/clean-code/SKILL.md:27`, change `twelve` to `thirteen`. After line 42, add:

```markdown
| 13 | Names that lie or say nothing | A name its body, type, or contents contradict; a whole name of `data`, `result`, or `manager`; a `new`, `old`, or `v2` marker | Name what the thing is and does now; `/check-names` gives the fresh-eyes pass |
```

- [ ] **Step 5: Fix the dangling reference in `autopilot`**

In `skills/autopilot/SKILL.md:84`, replace `Naming, Subagent Use` with ``[`/check-names`](../check-names/SKILL.md), Subagent Use``.

- [ ] **Step 6: Make the skill discoverable**

- `skills/magic-help/SKILL.md`, after line 93, add:

  ```markdown
  | Check the names a diff adds, using a reviewer that didn't choose them | [`/check-names`](../check-names/SKILL.md) |
  ```

- `README.md:115`: add ``[`check-names`](skills/check-names/SKILL.md)`` after the `no-comments` link, and add "checks the names the diff adds," after "strips narration comments,".
- `docs/magic-guide/README.md:11`: the list ends with `/unslop`, then "and", then `/no-comments`. Make it end with `/unslop`, `/no-comments`, then "and", then `/check-names`.
- `docs/magic-guide/05-build-and-clean.md`: after the paragraph at line 73, add a section headed ``## Check the names with `/check-names` ``. It holds 4 to 6 sentences: names need fresh eyes for the same reason comments do, the invocation `/check-names the diff` in a `text` block, that the reviewer reads the body before the name and reports only clear failures against a rubric, that it covers only names the diff adds, and that it reads the project's `CONTEXT.md` when one exists.
- Same file, line 75: extend the division-of-labour sentence so it ends ``and `/check-names` hands the names to a reviewer who didn't choose them.``
- Same file, line 73: change "a read-only reviewer" to "a reviewer", because `agents/comment-sicko/agent.md:7` says `readonly: false`.

- [ ] **Step 7: Run the Suite**

Run: the five Suite commands.
Expected: all green, with `tests/magic-sync.test.mjs` still passing.

- [ ] **Step 8: Commit**

```bash
git add skills/magic-mode skills/clean-code/SKILL.md skills/autopilot/SKILL.md skills/magic-help/SKILL.md README.md docs/magic-guide
git commit -m "feat(magic-mode): run check-names before review"
```

---

### Task 5: Governing baseline and gate

This task changes nothing in the kit. It decides whether Task 6 runs. Follow the blinding rules in `skills/magic-mode/playbooks/eval.md:5-13`.

**Files:**

- Create (outside the repo): `/tmp/run-a1`, `/tmp/run-a2`, `/tmp/run-a3`, each a clone of `/tmp/orders-service` at `main`
- Append (local): `docs/research/naming-baseline.md`

**Interfaces:**

- Consumes: the fixture's `main` branch from Task 1; `name-critic` from Task 2.
- Produces: `control_findings`, the total accepted findings across the three control runs, and the list of rule ids they cite. Task 6 consumes both.

- [ ] **Step 1: Run three control candidates**

Spawn three `magic-agent` subagents in parallel, one per clone. Each brief holds the absolute path of this branch's `skills/magic-mode/SKILL.md`, the clone path, and exactly this request:

```text
Add express orders to this service. (1) A faster total for orders under 5 lines that skips the per-line tax lookup; keep the current calculation for everything else. (2) Look up a client by id and create them when they are missing. (3) A 30 second retry delay for the carrier call. (4) An option to turn off confirmation emails. Commit on a branch named express-orders.
```

- [ ] **Step 2: Review each candidate's diff with `name-critic`**

One fresh `name-critic` run per clone, scoped to `express-orders` against `main`, with the rubric and the clone's `CONTEXT.md`.

- [ ] **Step 3: Read every diff yourself and accept or reject each finding**

Apply the rejection rules from `skills/check-names/SKILL.md` step 2. Record per clone: accepted `blocker` count, accepted `suggestion` count, and rule ids.

- [ ] **Step 4: Apply the gate and record it**

| Result | Action |
| --- | --- |
| `control_findings` is 1 or 0, with no `blocker` | Do not run Task 6. Record "principle not shipped: agents already comply" with the three diffs as evidence. Report to the owner. |
| Anything else | Run Task 6. Record the rule ids, most frequent first. |

---

### Task 6: The governing principle (only if Task 5's gate opens)

**Files:**

- Create: `skills/principle-name-things-honestly/SKILL.md`
- Modify: `skills/magic-mode/SKILL.md` (Principles index, Core group, after the **Minimize Reader Load.** entry)
- Modify: `docs/CATALOG.md` (the counts line, the principles heading, and the principles table after the `minimize-reader-load` row)
- Modify: `README.md:137`
- Modify: `CONTEXT.md:41`
- Modify: `docs/magic-guide/08-principles.md`
- Test: `tests/version-sync.test.mjs:152-158`, `tests/opencode-and-pi-plugins.test.mjs:147,157,181`

**Interfaces:**

- Consumes: `control_findings` and the ranked rule ids from Task 5.

- [ ] **Step 1: Update the count literals in the tests**

In `tests/version-sync.test.mjs:152-158`, change `77` to `78` and `25` to `26`. In `tests/opencode-and-pi-plugins.test.mjs:147,157,181`, change `77` to `78`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test tests/*.test.mjs`
Expected: 2 failures, on `78 active skills` and on `expected 78 skills`.

- [ ] **Step 3: Write `skills/principle-name-things-honestly/SKILL.md`**

Frontmatter, exactly:

```yaml
---
description: "Apply when you name anything a diff adds, such as a function, type, variable, file, test, config key, or flag. A name is a claim the reader acts on without opening the body, so it states what the thing is and does now, in the project's terms."
enabled: true
id: principle-name-things-honestly
name: principle-name-things-honestly
---
```

Body, 150 to 300 words, in the shape of `skills/principle-minimize-reader-load/SKILL.md`:

- A title line `# Name Things Honestly`.
- One opening paragraph: a reader acts on a name without opening the body, and an agent copies the names it is given, so a false name spreads.
- One bullet per rule id that Task 5 recorded, most frequent first, at most six. Each bullet states the rule and one bad-to-good example taken from the control diffs. Write no bullet for a rule the control runs never broke.
- `**The test:**` the Reader Test in one sentence.
- One line starting "You skipped this when", naming the most frequent failure from Task 5.
- A closing pointer to `../check-names/references/rubric.md` for the full rules, and to the **architect** skill when no honest short name exists.

- [ ] **Step 4: Add the index entry and the doc entries**

- `skills/magic-mode/SKILL.md`, after the **Minimize Reader Load.** entry, add:

  ```markdown
  - **Name Things Honestly.** Naming anything a diff adds. A name is a claim a reader acts on without opening the body, so it states what the thing is and does now, in the project's terms.
  ```

- `docs/CATALOG.md`: on the counts line, `77` to `78` and `25` to `26`. Heading `## 25 Engineering Principles` to `## 26 Engineering Principles`. After the `minimize-reader-load` row, add:

  ```markdown
  | `core` | [name-things-honestly](../skills/principle-name-things-honestly/SKILL.md) | State what the thing is and does now, in the project's terms; never a name its body contradicts |
  ```

- `README.md:137`: `77` to `78`, `25` to `26`.
- `CONTEXT.md:41`: `One of the 25` to `One of the 26`.
- `docs/magic-guide/08-principles.md:3`: `25 principles` to `26 principles`. Heading `## The 25, briefly` to `## The 26, briefly`. After the Minimize Reader Load bullet, add a bullet linking `../../skills/principle-name-things-honestly/SKILL.md` that says it "names each thing for what it is and does now, so a reader can trust the name without opening the body."

- [ ] **Step 5: Run the Suite to verify it passes**

Run: the five Suite commands.
Expected: `checked 78 skills, 8 agents, 5 rules` and all green.

- [ ] **Step 6: Run three variant candidates**

Repeat Task 5 steps 1 to 3 in fresh clones `/tmp/run-b1` to `/tmp/run-b3`, with the same request. The brief's `skills/magic-mode/SKILL.md` path now points at the working tree that holds the principle. Record `variant_findings`.

- [ ] **Step 7: Confirm from transcripts that each variant candidate opened the principle**

Read each candidate's transcript and check that it read `skills/principle-name-things-honestly/SKILL.md`. Grade from the files it opened, never from its own claims (`skills/magic-mode/playbooks/eval.md:22`).

- [ ] **Step 8: Apply the ship criteria**

| Result | Action |
| --- | --- |
| `variant_findings` is at most half of `control_findings`, with no `blocker` | Ship. Continue to step 9. |
| Otherwise, first time | Revise the bullets that govern the rules still broken. Repeat steps 6 to 8 once. |
| Otherwise, second time | Do not ship. Revert this task's changes with `git restore skills/magic-mode/SKILL.md docs/CATALOG.md README.md CONTEXT.md docs/magic-guide/08-principles.md tests` and `rm -r skills/principle-name-things-honestly`, record the numbers, and report to the owner. |

- [ ] **Step 9: Commit**

```bash
git add skills/principle-name-things-honestly skills/magic-mode/SKILL.md docs/CATALOG.md README.md CONTEXT.md docs/magic-guide/08-principles.md tests/version-sync.test.mjs tests/opencode-and-pi-plugins.test.mjs
git commit -m "feat(principles): add name-things-honestly to the principles index"
```

---

## Delivery

| Pull request | Tasks | Contents |
| --- | --- | --- |
| 1 | 1 to 4 | The verify lane and its wiring, as two or three commits |
| 2 | 5 and 6 | The governing principle, only if the gate opens |

Each pull request's Verification section quotes the criteria table from `docs/research/naming-baseline.md`, because that file is not committed.
