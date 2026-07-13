#!/usr/bin/env node
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { auditDist, formatDistAudit } from "./lib/dist-audit.mjs";

const APP = join(dirname(fileURLToPath(import.meta.url)), "..");
const distArg = process.argv.find((arg) => arg.startsWith("--dist="))?.slice("--dist=".length);
const baseArg = process.argv.find((arg) => arg.startsWith("--base="))?.slice("--base=".length);

try {
  const result = auditDist({ dist: distArg || join(APP, "dist"), base: baseArg || "/ge-agent-factory" });
  if (process.argv.includes("--json")) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else (result.ok ? process.stdout : process.stderr).write(`${formatDistAudit(result)}\n`);
  process.exitCode = result.ok ? 0 : 1;
} catch (error) {
  process.stderr.write(`Docs-site audit failed: ${error.message}\n`);
  process.exitCode = 1;
}
