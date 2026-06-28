#!/usr/bin/env node
// Layering guard: tools/lib/* must not statically import apps/factory. That edge
// is the tools<->apps import cycle (Week-4) and blocks a clean single-binary
// entry point. The two cycle-break modules are allowlisted — they are the
// designated downward boundary that owns the app-domain ops factory-core used to
// import. Exits non-zero on any violation (wire into the CI gate).
import { readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "tinyglobby";

const TOOLS = dirname(fileURLToPath(import.meta.url));
const ALLOW = new Set(["factory-catalog.mjs", "factory-local-ops.mjs"]);
const APP_FROM = /from\s+["'][^"']*apps\/factory[^"']*["']/;

const files = globSync("lib/**/*.mjs", { cwd: TOOLS, ignore: ["**/*.test.mjs"] });
const violations = [];
for (const rel of files) {
  if (ALLOW.has(basename(rel))) continue;
  const text = readFileSync(join(TOOLS, rel), "utf8");
  text.split("\n").forEach((line, i) => {
    if (APP_FROM.test(line)) violations.push(`tools/${rel}:${i + 1}  ${line.trim()}`);
  });
}

if (violations.length) {
  console.error(`✗ ${violations.length} forbidden tools/lib -> apps/factory import(s):`);
  for (const v of violations) console.error(`  ${v}`);
  console.error("Move the operation into a shared package or tools/lib/factory-{catalog,local-ops}.mjs.");
  process.exit(1);
}
console.log("✓ no tools/lib -> apps/factory imports");
