import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = path.resolve(import.meta.dirname, "..");
const read = (rel) => fs.readFileSync(path.join(repoRoot, rel), "utf8");

const REPLY_STYLE = "skills/magic-mode/references/reply-style.md";

const SKILLS_USING_REPLY_STYLE = [
	"skills/magic-mode/SKILL.md",
	"skills/how/SKILL.md",
	"skills/why/SKILL.md",
	"skills/teach/SKILL.md",
	"skills/interrogate/SKILL.md",
	"skills/blast-radius/SKILL.md",
	"skills/research/SKILL.md",
	"skills/recall/SKILL.md",
	"skills/benchmark-checklist/SKILL.md",
	"skills/arena/SKILL.md",
	"skills/swarm/SKILL.md",
	"skills/magic-help/SKILL.md",
	"skills/autopilot/SKILL.md",
	"skills/correct/SKILL.md",
	"skills/reflect/SKILL.md",
	"skills/figure-it-out/SKILL.md",
	"skills/tdd/SKILL.md",
	"skills/clean-code/SKILL.md",
	"skills/writing-rules/SKILL.md",
];

const SUBAGENT_TEMPLATES = [
	"skills/how/references/explainer-prompt.md",
	"skills/why/references/synthesizer-prompt.md",
	"agents/research-synthesizer/agent.md",
];

const FIXED_FORMAT =
	/at most 1-2 sentences|1-2 sentences? max|1-2 sentences per block|Never write a paragraph longer|End every finished turn|End the finished turn|Required at the bottom/i;

test("the reply style is one reference that adapts to the request", () => {
	const style = read(REPLY_STYLE);
	assert.match(style, /A format the user asks for always wins/);
	assert.match(style, /No headings, no table, no TL;DR/);
	assert.match(style, /Close with `## TL;DR` only when the reply is long/);
	assert.match(style, /Use a table for items that share attributes/);
	assert.match(style, /Skip it when a sentence covers the flow/);
	assert.match(style, /The shape can change\. The content cannot\./);
});

test("skills point at the reply style and fix no format of their own", () => {
	for (const rel of SKILLS_USING_REPLY_STYLE) {
		const content = read(rel);
		assert.ok(content.includes("references/reply-style.md"), `${rel} must point at the reply style`);
		assert.doesNotMatch(content, FIXED_FORMAT, `${rel} must not fix a reply format`);
	}
});

test("subagent templates scale their structure to the question", () => {
	for (const rel of SUBAGENT_TEMPLATES) {
		assert.doesNotMatch(read(rel), FIXED_FORMAT, `${rel} must not fix a reply format`);
	}
	const explainer = read("skills/how/references/explainer-prompt.md");
	assert.match(explainer, /Drop a section that has nothing to say/);
	assert.match(explainer, /Skip the diagram when a sentence covers the flow/);
	assert.match(read("skills/why/references/synthesizer-prompt.md"), /Drop a section that has nothing to say/);
});

test("magic-mode scales its defaults and playbooks to the size of the task", () => {
	const magicMode = read("skills/magic-mode/SKILL.md");
	assert.match(magicMode, /^## Defaults$/m);
	assert.doesNotMatch(magicMode, /^## Non-negotiables$/m);
	assert.match(magicMode, /needs no playbook, todo list, or subagent/);
	assert.match(magicMode, /For nontrivial work, open a todolist/);
});
