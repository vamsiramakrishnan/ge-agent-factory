import { readFileSync } from "node:fs";

export const AGENTS_CLI_VERSION_FILE = new URL("../../apps/factory/agents-cli-version.txt", import.meta.url);
export const AGENTS_CLI_VERSION = readFileSync(AGENTS_CLI_VERSION_FILE, "utf8").trim();

if (!/^\d+\.\d+\.\d+$/.test(AGENTS_CLI_VERSION)) {
  throw new Error(`Invalid agents-cli version in ${AGENTS_CLI_VERSION_FILE.pathname}: ${AGENTS_CLI_VERSION || "<empty>"}`);
}

export const AGENTS_CLI_PACKAGE_SPEC = `google-agents-cli==${AGENTS_CLI_VERSION}`;
