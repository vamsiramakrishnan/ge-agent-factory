import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { AGENTS_CLI_PACKAGE_SPEC, AGENTS_CLI_VERSION } from "./agents-cli-version.mjs";
import { REPO_ROOT } from "./state-paths.mjs";

test("all runtime installers consume the canonical agents-cli version file", () => {
  expect(AGENTS_CLI_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  expect(AGENTS_CLI_PACKAGE_SPEC).toBe(`google-agents-cli==${AGENTS_CLI_VERSION}`);

  const builder = readFileSync(join(REPO_ROOT, "apps/factory/builder.Dockerfile"), "utf8");
  const worker = readFileSync(join(REPO_ROOT, "apps/factory/Dockerfile"), "utf8");
  const console = readFileSync(join(REPO_ROOT, "apps/console/Dockerfile"), "utf8");
  const mise = readFileSync(join(REPO_ROOT, "mise.toml"), "utf8");
  expect(builder).toContain("agents-cli-version.txt");
  expect(worker).toContain("agents-cli-version.txt");
  expect(console).toContain("agents-cli-version.txt");
  expect(mise).toContain("apps/factory/agents-cli-version.txt");
  expect(`${builder}\n${worker}\n${console}\n${mise}`).not.toContain("google-agents-cli>=0.2,<0.3");
});
