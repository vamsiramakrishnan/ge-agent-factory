#!/usr/bin/env node
// Freezes the apps/* -> tools/lib/* import surface. Companion to
// tools/check-no-app-imports.mjs (which guards the opposite direction);
// same scan/report style.
//
// Apps may only import the tools/lib modules already on the allowlist below —
// the exact importer -> module pairs that existed when the guard landed
// (WS1, 2026-07-02). The list is SHRINK-ONLY: when a seam is retired, delete
// its pair; never add one. New shared needs route through the @ge/std leaf
// package or a registry/transport seam, not another ad-hoc reach into
// tools/lib internals.
//
// Exits non-zero on any unlisted import (wired into `bun run source:hygiene`).
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "tinyglobby";

const TOOLS = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(TOOLS);

// The frozen surface: "importer file -> tools/lib module" pairs, re-derived
// from the live tree at freeze time. Shrink-only — see header.
const ALLOWED_PAIRS = new Set([
  "apps/console/src/server/transport-oracle.test.mjs -> tools/lib/state-paths.mjs",
  "apps/console/src/server/transport.mjs -> tools/lib/factory-core.mjs",
  "apps/console/src/server/transport/autopilot.mjs -> tools/lib/autopilot-runner.mjs",
  "apps/console/src/server/transport/autopilot.mjs -> tools/lib/factory-core.mjs",
  "apps/console/src/server/transport/doctor.mjs -> tools/lib/factory-core.mjs",
  "apps/console/src/server/transport/jobs.mjs -> tools/lib/exec-stream.mjs",
  "apps/console/src/server/transport/jobs.mjs -> tools/lib/factory-core.mjs",
  "apps/console/src/server/transport/ledger.mjs -> tools/lib/factory-core.mjs",
  "apps/console/src/server/transport/ledger.mjs -> tools/lib/ledger/run-ledger-firestore.mjs",
  "apps/console/src/server/transport/logs.mjs -> tools/lib/factory-core.mjs",
  "apps/console/src/shared/ge-commands.mjs -> tools/lib/ge-command-registry.mjs",
  // The command registry is the sanctioned cross-surface contract (route/CLI/
  // risk per command) — the docs site reads it at build time through the same
  // re-export-shim seam the console uses, so rendered command docs
  // (CommandCard.astro) can never drift from the registry.
  "apps/docs/src/lib/ge-commands.mjs -> tools/lib/ge-command-registry.mjs",
  "apps/factory/src/factory-worker-logtap.test.mjs -> tools/lib/ledger/run-ledger-firestore.mjs",
  "apps/factory/src/factory-worker.js -> tools/lib/events.mjs",
  "apps/factory/src/factory-worker.js -> tools/lib/exec-stream.mjs",
  "apps/factory/src/harness-journal.js -> tools/lib/events.mjs",
  "apps/factory/src/state-paths.test.mjs -> tools/lib/state-paths.mjs",
  "apps/factory/src/web-server.js -> tools/lib/control-auth.mjs",
]);

// Every import/require/export-from/dynamic-import specifier on a line
// (same shape as check-no-app-imports.mjs's SPEC_RE).
const SPEC_RE = /(?:\bfrom\s+|\bimport\s+|\b(?:require|import)\(\s*)["']([^"']+)["']/g;
const TOOLS_LIB = /tools\/lib\//;

const files = globSync("apps/**/*.{mjs,js,ts,tsx}", {
  cwd: ROOT,
  ignore: ["**/node_modules/**", "**/dist/**", "**/generated/**", "**/.vite/**"],
});

const seen = new Set();
const violations = [];
for (const rel of files) {
  const text = readFileSync(join(ROOT, rel), "utf8");
  const posixRel = rel.split("\\").join("/");
  text.split("\n").forEach((line, i) => {
    for (const m of line.matchAll(SPEC_RE)) {
      const spec = m[1];
      if (!TOOLS_LIB.test(spec)) continue;
      // Normalize "../../../../tools/lib/foo.mjs" -> "tools/lib/foo.mjs".
      const module = "tools/lib/" + spec.slice(spec.lastIndexOf("tools/lib/") + "tools/lib/".length);
      const pair = `${posixRel} -> ${module}`;
      seen.add(pair);
      if (!ALLOWED_PAIRS.has(pair)) {
        violations.push(`${posixRel}:${i + 1}  ${line.trim()}`);
      }
    }
  });
}

if (violations.length) {
  console.error(`✗ ${violations.length} apps/* -> tools/lib import(s) outside the frozen surface:`);
  for (const v of violations) console.error(`  ${v}`);
  console.error("shrink-only allowlist — route new needs through `@ge/std` or a registry/transport seam, do not extend this list.");
  process.exit(1);
}

const stale = [...ALLOWED_PAIRS].filter((pair) => !seen.has(pair)).sort();
if (stale.length) {
  console.log(`ℹ ${stale.length} allowlisted pair(s) no longer imported — trim them from tools/check-app-import-surface.mjs:`);
  for (const pair of stale) console.log(`  ${pair}`);
}
console.log(`✓ apps/* -> tools/lib import surface frozen (${seen.size} allowed pair(s) in use)`);
