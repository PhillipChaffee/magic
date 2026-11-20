import fs from "node:fs";
import path from "node:path";

export const BOOTSTRAP_MARKER = "<magic-routing>";

const ROUTING_NOTICE = "The user turned on magic routing for every session with MAGIC_ROUTING=always.";

const DEFAULT_PREAMBLE =
	"The using-magic skill follows and is already loaded. Loading it again with the skill tool would be redundant.";

export function routingEnabled(env = process.env) {
	return env.MAGIC_ROUTING === "always";
}

const _bootstrapCache = new Map();

export function extractAndStripFrontmatter(content) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) return { frontmatter: {}, content };

	const frontmatterStr = match[1];
	const body = match[2];
	const frontmatter = {};
	let lastKey = null;

	for (const rawLine of frontmatterStr.split("\n")) {
		const line = rawLine.replace(/\r$/, "");
		const colonIdx = line.indexOf(":");
		if (colonIdx > 0 && !/^\s/.test(line)) {
			const key = line.slice(0, colonIdx).trim();
			const value = line.slice(colonIdx + 1).trim();
			frontmatter[key] = /^(>[+-]?|\|[+-]?)$/.test(value) ? "" : value;
			lastKey = key;
		} else if (lastKey !== null && line.trim() !== "") {
			frontmatter[lastKey] = `${frontmatter[lastKey]} ${line.trim()}`.trim();
		}
	}

	for (const key of Object.keys(frontmatter)) {
		frontmatter[key] = frontmatter[key].replace(/^(["'])([\s\S]*)\1$/, "$2");
	}

	return { frontmatter, content: body };
}

export function loadBootstrapContent(skillsDir, toolMapping, preamble = DEFAULT_PREAMBLE) {
	const cacheKey = `${skillsDir}\0${toolMapping}\0${preamble}`;
	if (_bootstrapCache.has(cacheKey)) return _bootstrapCache.get(cacheKey);

	const skillPath = path.join(skillsDir, "using-magic", "SKILL.md");
	if (!fs.existsSync(skillPath)) {
		_bootstrapCache.set(cacheKey, null);
		return null;
	}

	const fullContent = fs.readFileSync(skillPath, "utf8");
	const { content } = extractAndStripFrontmatter(fullContent);
	const formatted = `${BOOTSTRAP_MARKER}\n${ROUTING_NOTICE}\n\n${preamble}\n\n${content.trim()}\n\n${toolMapping}\n</magic-routing>`;
	_bootstrapCache.set(cacheKey, formatted);
	return formatted;
}
