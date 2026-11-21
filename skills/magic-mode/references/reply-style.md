# Reply style

The default shape for a reply from a magic skill. Treat it as a starting point and fit it to the request. A format the user asks for always wins.

## Fit the reply to the request

| The request | The reply |
| --- | --- |
| A quick question or a yes/no | One or two plain sentences. No headings, no table, no TL;DR. |
| A conversational turn or a status check | A short paragraph or a few bullets. |
| One finding, one change, or one fix | The outcome first, then the evidence. Add headings only when the reply has distinct parts. |
| A report with several findings, options, or sections | Sections that each open with a framing sentence, tables or diagrams where they carry the detail, and a closing `## TL;DR`. |

## Defaults

- **Lead with the answer.** The first sentence states the outcome or the conclusion.
- **Keep prose short.** One thought per sentence. Most paragraphs need one to three sentences. Write a longer one when an argument needs its steps kept together.
- **Use a table for items that share attributes.** Options with tradeoffs, files with roles, and before and after numbers fit a table. Two items, or items with one attribute, read better as a sentence or as bullets.
- **Use bullets for parallel points.** Use prose when the points depend on each other.
- **Use a diagram when words lose the reader.** A flow with three or more steps, a boundary between components, or a state machine can earn a Mermaid diagram. Skip it when a sentence covers the flow.
- **Close with `## TL;DR` only when the reply is long.** A reply with several sections, or one longer than a screen, ends with one or two plain sentences that state the takeaway. A short reply is its own summary.
- **Keep the content a skill asks for.** When a skill names what its reply carries, such as findings, evidence, or a verdict, include all of it. The shape can change. The content cannot.
