# Worked examples

Two abbreviated runs, one per mode. They show the shape of each step, not text to copy.

## 1. Eight product decisions for a desktop app

**Collect.** A feature task ended with eleven open questions. Ids were one word each, such as `tray`, `quit`, `resize`, `sync`.

**Verify.** A read-only subagent ran the app and recorded each flow. Its brief said to leave the repo untouched, record what actually happens, and report any claim that did not reproduce. Recording the app corrected three earlier claims.

| Id | Earlier claim | What the recording showed |
| --- | --- | --- |
| `quit` | Closing the last window quits the app | The process stays alive in the tray |
| `resize` | The sidebar keeps its width across restarts | The width resets on every launch |
| `sync` | Sync starts when the window gains focus | Sync starts 30 s after launch, whatever has focus |

**Triage.** Three had a platform convention or an answer in the code and were settled without asking. Eight remained, the three corrected ones among them.

**Build.** One page with eight cards.

- Six cards carried a short recording each, captioned, with the click point marked.
- Two cards (`sync`, `autosave`) were about things invisible in the window. Each carried a timeline labelled as a diagram.
- The two design choices carried drawn mock-ups of each option, labelled as drawings, with the new control outlined.
- The three corrections each appeared as a "found while checking" line on their card.
- The facts card said the app was checked on Linux only, and that macOS tray behaviour was not verified.

**Return.** The user pasted this.

```text
tray: Keep running in the tray
quit: Quit when the last window closes | note: but keep the tray on macOS
resize: Remember the width
sync: Leave it as it is
autosave: Save on blur as well
theme: (not picked)
empty: Illustration and one button
shortcuts: Leave it as it is
```

**Act.** `sync` and `shortcuts` needed no work and were named in one line. The agent asked about `theme` only. The other five went to a decisions file, then five changes with their own tests, three in parallel because their files did not overlap. Each visual change was recorded again and shown.

## 2. Sixty review findings

**Collect.** Four reviewers produced sixty findings as prose. The agent normalised them into the structured list and merged duplicates. Sixty became forty-six, each keeping every source id.

**Verify.** A separate agent checked all forty-six against the code. It received the code and each claim, not the reviewers' conclusions.

| Verdict | Count | Note |
| --- | --- | --- |
| Confirmed | 14 | |
| Adjusted | 26 | The problem was real and the remedy changed |
| Rejected | 6 | Disproved by a guard, a test, or a caller the reviewer did not read |

Three remedies described as "neutral" changed behaviour. Each fixed a real problem and failed a test that pinned the current behaviour, so each became a card.

**Triage.** After verification the forty-six sorted into three piles.

| Pile | Count | Shape on the page |
| --- | --- | --- |
| Will do unless you object | 27 | One table, one toggle per row |
| Needs your call | 13 | Eight real bugs and five trade-offs, one card each |
| Rejected on checking | 6 | Collapsed, one-line reason each |

The five trade-offs were the three "neutral" claims, one new dependency, and one pair of findings with incompatible remedies shown as a single card.

**Build.** Each bug card carried the offending code, the smallest diff that fixes it, the failing input and the wrong result, and whether it was reproduced. Relationships were stated on the cards, such as "F31 needs F12 first".

**Return.** The user pasted this (abbreviated).

```text
will-do: all except F7, F19
F3: Fix now, as its own change
F12: Reject
F31: Apply as proposed
F40: Apply the smaller version | note: skip the rename
```

**Act.** The summary box had already flagged that F31 was accepted while F12, which it needs, was rejected. The agent asked about that pair only. The will-do rows went into packages that touched disjoint files and ran in parallel. Each bug fix was its own commit with a test seen failing first. The behaviour tests were named up front and rerun after every structural step. The report listed each item as done, done smaller, deferred or rejected, with its commit and any side effect.
