#!/usr/bin/env node

import { formatDocsCheck, runDocsCheck } from "./lib/docs-check.mjs";

const json = process.argv.includes("--json");
const result = runDocsCheck();

if (json) {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} else {
  const writer = result.ok ? process.stdout : process.stderr;
  writer.write(`${formatDocsCheck(result)}\n`);
}

process.exit(result.ok ? 0 : 1);
