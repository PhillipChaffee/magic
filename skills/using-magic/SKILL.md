---
description: Use when the user asks to turn on magic routing, runs /using-magic, or set MAGIC_ROUTING=always. Routes each task to its magic entry-point skill for the rest of the session.
enabled: true
id: using-magic
name: using-magic
---

# Using Magic

Routing is opt-in. It is on when the user ran `/magic-mode` or `/using-magic` in this session, or set `MAGIC_ROUTING=always` so that this skill loads at session start. When routing is off, use a magic skill only when the user names it or it clearly fits the request.

## Entry-Point Routing

While routing is on, load the matching entry-point skill before you start work on a task.

| Observable task signal | Entry-point skill |
| --- | --- |
| Writing, editing, debugging, refactoring, testing, reviewing, or shipping code, docs, or configuration, or running multi-step engineering workflows | [`/magic-mode`](../magic-mode/SKILL.md) |
| Opening, creating, updating, or preparing a pull request or merge request for review | [`/clean-code`](../clean-code/SKILL.md) (on code diffs before opening or updating) and [`/make-pr-easy-to-review`](../make-pr-easy-to-review/SKILL.md) (on PR/MR structure and description) |
| Investigating a codebase, comparing options, or answering how, why, or where questions across files, web, or MCP | [`/research`](../research/SKILL.md) |
| Producing a brief, cited research summary with a head-to-head comparison table | [`/research-summary`](../research-summary/SKILL.md) |
| Writing or auditing formal proofs, loop invariants, state machines, or model-checked specifications | [`/proof-driven-development`](../proof-driven-development/SKILL.md) |
| Unsure which skill, playbook, or principle fits the request | [`/magic-help`](../magic-help/SKILL.md) |

## When to Skip Routing

Do the task directly when one of these holds:

- The user names a narrower skill. Load and follow that skill instead.
- You were spawned as a subagent to execute a scoped subtask that does not open or update a pull request or merge request. A subagent that does open or update one still runs `/clean-code` (when code changed) and `/make-pr-easy-to-review`.
- The prompt is pure conversation with no repository, tool, or code action.
- The prompt is a single-fact lookup answerable in one file read or search call.
- The task is small and fully specified, such as a one-line edit.

## Turning Routing Off

The user can turn routing off at any time by saying so. Stop routing for the rest of the session when they do.

## Platform Adaptation

Read [harness-adapter.md](../magic-mode/references/harness-adapter.md) once per session for how neutral terms in kit skills map to your active harness (`Cursor`, `Claude Code`, `Codex`, `OpenCode`, and `Pi`).

## User Instructions

Direct user instructions and project rules (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `rules/`) take precedence over skills, which in turn override default model habits.
