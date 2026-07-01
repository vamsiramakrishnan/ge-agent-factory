#!/usr/bin/env node
// Gated test runner: turns AGENTS.md's "judge test health by the set of failing
// test names, not the raw count" from a manual cross-reference into a
// structural pass/fail. Runs the suite with the JUnit reporter, parses out the
// actual failing test names, and buckets them against tools/known-test-failures.json:
//   - newly failing   -> a real regression, exits non-zero
//   - still failing   -> accepted baseline, informational only
//   - now passing     -> known list is stale, informational only (flagged, not auto-trimmed)
//
// This is the print/exit boundary; parsing/comparison logic lives in
// tools/lib/test-results.mjs (see AGENTS.md's "return/throw, don't print/exit"
// convention for library code).

import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { bucketTestResults, failingTestNamesFromJUnit, formatTestResultsReport } from "./lib/test-results.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const KNOWN_FAILURES_PATH = join(REPO_ROOT, "tools", "known-test-failures.json");

// Same scope as the "test" script in package.json (bun test apps tools packages).
// Extra argv passed to this script is forwarded to `bun test` as-is, so callers
// can narrow scope (e.g. `node tools/check-test-results.mjs apps/factory`) the
// same way they would with `bun run test`.
const DEFAULT_ARGS = ["apps", "tools", "packages"];

function main() {
  const forwardedArgs = process.argv.slice(2);
  const testArgs = forwardedArgs.length > 0 ? forwardedArgs : DEFAULT_ARGS;

  const tmpDir = mkdtempSync(join(tmpdir(), "ge-test-results-"));
  const junitPath = join(tmpDir, "results.xml");

  let xml;
  try {
    const result = spawnSync(
      "bun",
      ["test", ...testArgs, "--reporter=junit", `--reporter-outfile=${junitPath}`],
      { cwd: REPO_ROOT, stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" },
    );

    // bun test prints its own console summary (pass/fail counts, stack traces)
    // to stdout/stderr; surface it so a human/agent reading this command's
    // output still sees the familiar per-test detail, not just the buckets.
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);

    if (result.error) {
      throw new Error(`failed to spawn bun test: ${result.error.message}`);
    }

    try {
      xml = readFileSync(junitPath, "utf8");
    } catch (err) {
      throw new Error(
        `bun test did not produce a JUnit report at ${junitPath} (exit code ${result.status}): ${err.message}`,
      );
    }

    const consoleSummary = extractConsoleFailCount(`${result.stdout ?? ""}\n${result.stderr ?? ""}`);
    reportSuiteCollectionMismatch(xml, consoleSummary);
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }

  const actualFailing = failingTestNamesFromJUnit(xml);
  const known = JSON.parse(readFileSync(KNOWN_FAILURES_PATH, "utf8"));
  const knownFailing = known.failures ?? [];

  const buckets = bucketTestResults(actualFailing, knownFailing);

  console.log("");
  console.log(formatTestResultsReport(buckets));

  process.exit(buckets.ok ? 0 : 1);
}

// bun's JUnit reporter omits a test file's <testsuite> entirely if the file
// throws before any test can be collected (e.g. the known Bun describe()/test()
// nesting limitation — see packages/runtime/src/index.test.mjs and
// packages/factory-install/tests/install-contract.test.mjs at time of writing).
// Such failures are invisible to the JUnit-based bucketing above. We can't
// recover their names, but we can at least warn loudly when bun's own console
// summary ("N fail") disagrees with the number of failing <testcase> entries we
// found, so this blind spot doesn't silently swallow a real regression.
function extractConsoleFailCount(text) {
  const m = /(\d+)\s+fail\b/.exec(text);
  return m ? Number(m[1]) : null;
}

function reportSuiteCollectionMismatch(xml, consoleFailCount) {
  if (consoleFailCount == null) return;
  const xmlFailCount = failingTestNamesFromJUnit(xml).length;
  if (consoleFailCount > xmlFailCount) {
    console.warn(
      `\n⚠ bun test reported ${consoleFailCount} failing test(s) but only ${xmlFailCount} appear as failing ` +
        `<testcase> entries in the JUnit report. This usually means a test file crashed before bun could ` +
        `collect any tests in it (invisible to name-based comparison) — check the console output above for ` +
        `files that errored outside of a testcase, e.g. "Unhandled error between tests".`,
    );
  }
}

main();
