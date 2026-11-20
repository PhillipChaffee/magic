---
description: "Use when work surfaces three or more decisions that are the user's to make, or for \"help me decide\", \"walk me through the decisions\", \"walk me through the findings\", \"mock up options\", \"show me so I can choose\", or when a code review, quality audit, refactor plan, or security review ends with findings that need the user's judgment. Not for a single question."
enabled: true
id: help-me-decide
name: help-me-decide
---

# Help me decide

Build one page that walks the user through every decision that is theirs, with evidence. They pick an option per decision and paste one block of text back. Then act on the paste, and on nothing before it.

Three or more open decisions go on a page, not in a chat message. A chat list has no evidence, no stable ids, and no clean way to answer from a phone.

## When to use

- The user says one of the trigger phrases in the description.
- A task ends with three or more open questions or findings that need the user's judgment.
- Another skill hands over findings.

Do not use it for one question. Ask that question. Do not use it for a choice the request, the code, or a conventional default settles. Make that choice and report it.

## Two modes, one flow

| | Product decisions | Findings |
| --- | --- | --- |
| Detect by | Questions about behaviour or appearance | Findings with a file and line, or a handover from a review, audit, refactor plan, or security review |
| Evidence | Screenshots, recordings, drawn mock-ups | Code, diffs, numbers |
| Ids | One lowercase word, such as `search` | The finding's own id, such as `F3` |
| Input | Your own open questions | A structured list (id, file, line, summary, failure scenario or problem, proposed remedy, severity) or prose findings. Normalise prose into that list first. |

## The flow

Copy these seven steps into the todo list.

### 1. Collect

List every open question or finding. Give each a short stable id that survives into the pasted answer. Merge duplicates first. The same problem seen from two places is one item. Its id is the first source id, and the card names the others, as in "F1 (also F6)".

### 2. Triage

Sort once now to see how much there is to check. Sort again after step 3, because verification moves items between piles.

**Product mode.** Remove anything the code answers or a conventional default settles, and say in the handover what you settled. A change to observable behaviour is never yours to settle, a bug fix you found on the way included. If verification shows a question rested on a wrong premise, keep the card when the behaviour is still a real choice. Keep roughly 3 to 9.

**Findings mode.** Sort every finding into one of three piles.

| Pile | What goes in | On the page |
| --- | --- | --- |
| Will do unless you object | Confirmed, mechanical, no behaviour change, no rule exception | One compact table at the top, one "object" toggle per row, no card |
| Needs your call | Changes observable behaviour (a real bug fix included), relaxes or adds an exception to a project rule, adds or removes a dependency, deletes a feature, trades one cost for another, or two findings propose incompatible remedies | One card each |
| Rejected on checking | Verification disproved the problem, so nothing is left to do | Collapsed, one-line reason, not asked about |

A finding whose problem is real but whose remedy turns out to change behaviour is a card. A finding with no real problem is rejected, whatever its remedy would do.

Aim for at most about ten cards. If more remain, group them by root cause and ask about the group.

### 3. Verify before asking

Establish what is true from the real artifact, not from memory or an earlier report. Expect this step to correct things said earlier. Those corrections go on the page. A new problem found while checking becomes its own item with a new id, sorted like the rest. A small one that an existing decision already covers goes on that card instead, and each option there says whether it fixes it.

**Product mode.** Run the app, read the code, record it. When evidence gathering is more than a few tool calls, give it to a read-only subagent. The brief says three things. Leave the repo untouched. Record what actually happens. If a claim does not reproduce, say so instead of staging it. With no subagent tool, gather the evidence yourself under the same three rules and say so in the handover.

**Findings mode.** Check each finding with a different agent from the one that produced it. If another agent wrote the findings, you can check them. If you wrote them, spawn a subagent. With no subagent tool, check them yourself from the code and say on the page that the check was not independent. Give the checker the code and the claim, not the reviewer's conclusion. Each finding comes back `confirmed`, `adjusted` (true, but the remedy changes) or `rejected`. Reviewers do not build anything, so check every claim that a change is "neutral" or "behaviour-preserving" by running the tests that pin the behaviour.

### 4. Build one page

Start from [`references/page-skeleton.html`](references/page-skeleton.html). Replace its sample content and keep its styles and script. Its opening comment lists what to replace and what to delete. It carries the card, option buttons, code and diff blocks, will-do table, summary box, and copy handler, and it is theme-aware and works at phone width. Publish the page as an Artifact where the harness has that tool. Otherwise write one self-contained HTML file and send it to the user.

The page has these parts, in this order.

1. One short paragraph. What was verified, and how to use the page.
2. A card of verified facts, when the decisions depend on them. It also states what you cannot verify in your environment, such as another OS, real hardware, or a logged-in service.
3. Findings mode only. The will-do table, then "accept all suggestions" and a severity filter.
4. One card per decision, most important first.
5. Findings mode only. The rejected findings, collapsed, each with its reason.
6. The summary box.

Every card has these slots. Fill each one.

| Slot | Content |
| --- | --- |
| Question | The decision as a question, in the user's words |
| Today | Two or three plain sentences on what is true today |
| Found while checking | Present when verification contradicted an earlier claim or exposed something new. In findings mode it also carries the verdict and its reason. |
| Evidence | See the two lists below |
| Relationships | Findings mode. "Needs F3 first", "conflicts with F5", "also resolves F8, F12" |
| Options | Two to four large buttons. Each has a name and one line on what it costs or changes. Exactly one carries the suggestion tag. |
| Note | An optional one-line text field |

**Evidence, product mode.**

- Real screenshots or short recordings, each captioned with what it shows. Mark click points with a marker drawn on the decision page over the image, never inside the app. In a single-file page, inline each image as a `data:` URI.
- For a design choice, a drawn mock-up of each option in the product's own colours and type. Label it as a drawing and visibly mark anything new. Add styles for the mock-ups to the skeleton's stylesheet.
- For something invisible in the window, a small timeline, labelled as a diagram.

**Evidence, findings mode.**

- The offending code, at most about 25 lines, with path and line numbers. The rest is reachable by path.
- The proposed change as a before/after or unified diff of the smallest version that fixes it. Mark additions and removals with `+` and `-` as well as colour.
- The numbers that size it. Files and lines touched, call sites, how many places repeat the pattern.
- What guards it. Which tests pin the current behaviour, which would have to change, any proofs or gates it touches.
- For a bug, the concrete failure. Inputs or steps, then the wrong result. Reproduce it where that is cheap, and say whether it was reproduced or only read from the code.
- A small diagram only where structure is the point, such as a dependency cycle, a state machine encoded as flags, or who writes a shared field.
- Escape all code before you insert it. Set it in a monospace face. Give each block its own horizontal scroll so the page never scrolls sideways.

**Options, product mode.** The real alternatives. Include "leave it as it is" whenever that is a real choice.

**Options, findings mode.** Offer the ones that apply. Each carries its cost in one line that covers size, risk, whether behaviour changes, and whether tests must change.

- Apply as proposed
- Apply the smaller version (state what is left out)
- Defer (name the follow-up)
- Reject
- For a bug, "Fix now, as its own change" and "Leave and document as known"

When an item has more than one real remedy, give each remedy its own option and name the option after what it does.

When a pick breaks a dependency, such as F4 accepted and F3 rejected, the summary box flags it. The skeleton does this from `data-needs` and `data-conflicts`.

### 5. Make the answers easy to return

The summary box at the bottom always holds the current picks as plain text, one line per decision. Findings mode adds one line for the will-do table.

```text
will-do: all except F7, F19
F1: Fix now, as its own change | note: cap at 100, do not reject
F8: (not picked)
```

- A "Copy choices" button writes that text to the clipboard inside the click handler. If the clipboard is refused, it selects the text instead.
- A sticky count such as "3 of 7" stays visible.
- Picks are kept in `localStorage` inside try/catch, so a reload does not lose them. The page says plainly when saving is unavailable.
- Copy and paste is the primary path. A shared database behind the page is an optional extra and never the only way back.

Open the rendered page at phone width, pick an option, and press Copy before you hand over. Use a throwaway browser profile so your test picks are not saved for the user, and grant it clipboard permission to see the copy succeed. If you could not, say so in the handover.

### 6. Hand over

The chat message has four parts and does not repeat the cards.

1. The link or the file.
2. How to answer. Pick, copy, paste.
3. The corrections verification produced.
4. What could not be tested and why, and whether the rendered page was checked.

Then stop. Change nothing until the picks come back.

### 7. Act on the paste

1. Parse it by id. If a line is missing or ambiguous, ask about that one only.
2. Name the items that need no work ("keep", "leave it", "reject") in one line.
3. Write the picks to a short decisions file that subagents can read, with the consequences each pick implies spelled out.
4. Implement each remaining item as its own change with its own tests, in parallel where files do not overlap. In findings mode, order accepted items by dependency into packages that touch disjoint files.
5. Keep bug fixes in their own commits, apart from structural changes, each with a test seen failing first.
6. For a refactor, state up front what must not change (the behaviour tests) and check it after every step.
7. Where the decision was visual, record the result again and show it.
8. Report per item. Done, done smaller, deferred or rejected, with the commit, what it cost, and any side effect the user did not explicitly choose.

## Rules

- Never put a question on the page that you could answer yourself.
- Every option says what it costs. No option is described only by its upside.
- Evidence is real or labelled as a drawing. Never present a mock-up as a screenshot, and never stage a recording to match the expected story.
- A proposed code change is shown as a diff, never only described.
- If a choice needs an exception to a project rule (a lint, a gate, a dependency policy), say so on the option itself, not afterwards.
- The suggestion tag is a recommendation, not a default. Nothing is acted on until the user returns their picks. The will-do table is the one exception, and it is acted on only after the user returns the `will-do:` line.
- Rejected findings stay visible, collapsed, with their reason.
- State on the page what you cannot verify in your environment.

## Common mistakes

| Mistake | Do this |
| --- | --- |
| Asking in chat for 3+ decisions because "they fit in a phone-readable message" | Build the page. The page is what makes them answerable from a phone. |
| Skipping verification and quoting the earlier report | Check the real artifact first. Put each correction on the card. |
| An option with no cost, or "my recommendation" with only an upside | One line per option on what it costs or changes. |
| A page whose only way back is a database write | The copy box is always there. A database is an extra. |
| Acting before the picks come back, or "reply go to take all my recommendations" | The suggestion tag is not a default. Wait for the paste. |
| Deciding a behaviour change yourself because you found it while checking | It is a card, or it waits. |
| One card per raw finding | Merge duplicates, then group by root cause. |
| Asking about mechanical changes | They go in the will-do table. |
| Showing a remedy with no diff | Show the smallest diff that fixes it. |
| Trusting the reviewer's "no behaviour change" | Run the tests that pin the behaviour. |
| Hiding rejected findings entirely | Keep them collapsed with a one-line reason. |

## Worked examples

Read [`references/examples.md`](references/examples.md) for one abbreviated run per mode.
