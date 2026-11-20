import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = path.resolve(import.meta.dirname, "..");
const skillsDir = path.join(repoRoot, "skills");

function userInvokedSkills() {
	return fs
		.readdirSync(skillsDir)
		.filter((name) => {
			const skillPath = path.join(skillsDir, name, "SKILL.md");
			if (!fs.existsSync(skillPath)) return false;
			const frontmatter = fs.readFileSync(skillPath, "utf8").split(/^---$/m)[1];
			return /^disable-model-invocation: true$/m.test(frontmatter);
		})
		.sort();
}

test("orchestrators that fan out, run long, or drive a PR load only when the user asks", () => {
	const userInvoked = userInvokedSkills();
	for (const name of [
		"arena",
		"autopilot",
		"correct",
		"create-formal-verification-skill",
		"create-verification-skill",
		"figure-it-out",
		"maintain-formal-verification-skill",
		"maintain-verification-skill",
		"reflect",
		"swarm",
	]) {
		assert.ok(userInvoked.includes(name), `${name} must set disable-model-invocation: true`);
	}
});

test("docs/CATALOG.md lists exactly the skills that load only when the user asks", () => {
	const catalog = fs.readFileSync(path.join(repoRoot, "docs/CATALOG.md"), "utf8");
	const section = catalog.split("### Skills That Load Only When You Ask")[1]?.split(/^---$/m)[0];
	assert.ok(section, "docs/CATALOG.md is missing the user-invoked skills section");
	const listLine = section.split("\n").find((line) => line.startsWith("`/"));
	const listed = [...listLine.matchAll(/`\/([a-z0-9-]+)`/g)].map((m) => m[1]).sort();
	assert.deepEqual(listed, userInvokedSkills());
});
