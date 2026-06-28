#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { validateAgentSpecQuality } from "../../../apps/factory/src/agent-spec-registry.js";

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  process.stdout.write("usage: validate-usecase-spec.mjs <usecase-spec.json>\n");
  process.exit(0);
}

const path = args[0];
if (!path) {
  process.stderr.write("usage: validate-usecase-spec.mjs <usecase-spec.json>\n");
  process.exit(1);
}

let spec;
try { spec = JSON.parse(readFileSync(path, "utf8")); }
catch (error) {
  process.stderr.write(`invalid JSON: ${error.message}\n`);
  process.exit(1);
}

const quality = validateAgentSpecQuality(spec);
process.stdout.write(JSON.stringify({
  ok: quality.ok,
  maturity: quality.maturity,
  gaps: quality.gaps,
}, null, 2) + "\n");
if (!quality.ok) process.exit(1);
