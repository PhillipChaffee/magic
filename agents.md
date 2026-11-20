# Repository guidance

This repository publishes the approved contents of the owner's `~/.agents`.
`agents.kit.md` is the home instruction file, installed as `~/.agents/agents.md`;
this file contains repository-only guidance.

## Sync boundaries

- Carry additions, edits, and deletions into `agents/`, `rules/`, and `skills/`.
- Keep `skills-disabled/` as an archive; do not install or activate it.
- Do not import home `scripts/`, credentials, or the generated `.kit-stamp`.
- Preserve upstream skill bytes and their notices. Check secrets in upstream
  copies even when their formatting and example links are excluded from lint.
- Retain repository documentation, installation, validation, and CI support.
- When adding a new rule via `/writing-rules`:
  - Add `rules/<name>.md` (sorted `alwaysApply` and `description` frontmatter) and a `<= 25`-word single-bullet pointer in `agents.kit.md`.
  - Update the rule count in `README.md` and the count and table in `docs/CATALOG.md`.
  - Run `./scripts/validate.sh`, `python3 -m unittest discover -s tests`, and `node --test tests/*.test.mjs`.

## Harness neutrality

- Keep every change harness-agnostic: it must work in each harness that `skills/magic-mode/references/harness-adapter.md` lists, never in one alone.
- In `skills/`, `rules/`, `agents/`, and `agents.kit.md`, use that file's neutral terms. When a change needs a harness-specific mechanism, add a harness adapter row with an equivalent or a stated fallback for every listed harness.
- Never make a feature, script, test, or eval depend on one harness's CLI, built-in feature, or file layout. Put per-harness code behind an adapter that covers every listed harness.

## Repository tooling

- Issues: GitHub Issues through `gh`.
- Domain docs: `CONTEXT.md` and `docs/adr/`.
