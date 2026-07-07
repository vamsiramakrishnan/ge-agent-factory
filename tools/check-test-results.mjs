#!/usr/bin/env node
// Gated test runner: turns AGENTS.md's "judge test health by the set of failing
// test names, not the raw count" from a manual cross-reference into a
// structural pass/fail. Runs the suite with the JUnit reporter, parses out the
// actual failing test names, and buckets them against tools/known-test-failures.json:
//   - newly failing   -> a real regression, exits non-zero
//   - still failing   -> accepted baseline, informational only
//   - now passing     -> known list is stale, informational only (flagged, not auto-trimmed)
//
// Sharding: the suite runs as one `bun test` per directory shard (each app
// under apps/, plus tools/ and packages/) with that shard as the process cwd,
// rather than one repo-root invocation. Two reasons (see planTestShards in
// tools/lib/test-results.mjs): a repo-root scan exceeds a 4096
// file-descriptor rlimit (EMFILE on sandboxed runners), and one process per
// app keeps bun's process-global mock.module() from leaking across apps. The
// shards' JUnit reports are merged before the known-failures comparison, so
// the gate's verdict is still a single suite-wide set of names.
//
// Flake retry: before judging, the test FILES containing newly-failing names are
// re-run exactly once (a single bounded retry, loudly logged). A name that
// recovers on the retry is reported as a flake and not counted as a regression;
// a real regression fails twice and still gates. This kills the "re-run the
// whole suite 2-3x because one subprocess-heavy golden test timed out under
// load" tax without hiding genuine breakage.
//
// Known-failure hygiene: entries in known-test-failures.json carry
// kind ("env" | "bug") and addedAt metadata. "bug" entries older than 30 days
// produce a loud warning — bugs are parked there so they don't block unrelated
// work, not accepted behavior, so they must not quietly become permanent.
//
// This is the print/exit boundary; parsing/comparison logic lives in
// tools/lib/test-results.mjs (see AGENTS.md's "return/throw, don't print/exit"
// convention for library code).

import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import {
  bucketTestResults,
  failingTestcasesFromJUnit,
  failingTestNamesFromJUnit,
  formatTestResultsReport,
  normalizeKnownFailureEntries,
  planTestShards,
  staleBugEntries,
} from "./lib/test-results.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const KNOWN_FAILURES_PATH = join(REPO_ROOT, "tools", "known-test-failures.json");

// How long a kind:"bug" entry may sit in known-test-failures.json before the
// checker starts warning about it on every run.
const BUG_ENTRY_MAX_AGE_DAYS = 30;

// The apps/ shard roots: one shard (and one bun process) per app directory.
function discoverAppShards() {
  return readdirSync(join(REPO_ROOT, "apps"), { withFileTypes: true })
    .filter((ent) => ent.isDirectory() && existsSync(join(REPO_ROOT, "apps", ent.name, "package.json")))
    .map((ent) => `apps/${ent.name}`)
    .sort();
}

/**
 * Run `bun test` for one shard (cwd at the shard root) with the JUnit
 * reporter and return the report XML. bun's own console output (pass/fail
 * counts, stack traces) is streamed through so a human/agent reading this
 * command still sees the familiar per-test detail. A shard whose filters
 * match no test files returns { xml: null } instead of throwing — an app
 * directory without tests is not a gate failure.
 */
function runBunTestShard({ root, filters, flags = [] }) {
  const cwd = root === "." ? REPO_ROOT : join(REPO_ROOT, root);
  const tmpDir = mkdtempSync(join(tmpdir(), "ge-test-results-"));
  const junitPath = join(tmpDir, "results.xml");
  try {
    const result = spawnSync(
      "bun",
      ["test", ...filters, ...flags, "--reporter=junit", `--reporter-outfile=${junitPath}`],
      { cwd, stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" },
    );

    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);

    if (result.error) {
      throw new Error(`failed to spawn bun test (shard ${root}): ${result.error.message}`);
    }

    const consoleText = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
    let xml;
    try {
      xml = readFileSync(junitPath, "utf8");
    } catch (err) {
      // No report + "no test files matched" is an empty shard, not a failure.
      if (/did not match any test files|0 tests? across 0 files/.test(consoleText)) {
        return { xml: null, consoleText };
      }
      throw new Error(
        `bun test (shard ${root}) did not produce a JUnit report at ${junitPath} (exit code ${result.status}): ${err.message}`,
      );
    }
    return { xml, consoleText };
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
}

function runShards(shards, flags) {
  const runs = [];
  for (const shard of shards) {
    console.log(`\n── bun test · shard ${shard.root}${shard.filters.length ? ` · ${shard.filters.join(" ")}` : ""} ──`);
    const { xml, consoleText } = runBunTestShard({ ...shard, flags });
    if (xml == null) {
      console.log(`(shard ${shard.root}: no matching test files — skipped)`);
      continue;
    }
    reportSuiteCollectionMismatch(shard.root, xml, extractConsoleFailCount(consoleText));
    runs.push({ shard, xml });
  }
  return runs;
}

/**
 * Re-run ONLY the test files containing newly-failing names, once per owning
 * shard, and return the newly-failing names that passed on the retry
 * ("recovered", i.e. flakes). Anything not recovered — including names that
 * cannot be attributed to a file (e.g. a file that crashed before test
 * collection) — stays a regression; no retry can vouch for it.
 */
function retryNewlyFailing({ runs, newlyFailing }) {
  const newlySet = new Set(newlyFailing);
  // name -> { file, shard }: JUnit file attribution is relative to the shard
  // cwd, so the retry must re-run each file under the same shard root.
  const nameToTarget = new Map();
  for (const { shard, xml } of runs) {
    for (const tc of failingTestcasesFromJUnit(xml)) {
      if (newlySet.has(tc.name) && tc.file) nameToTarget.set(tc.name, { file: tc.file, shard });
    }
  }
  const byShardRoot = new Map();
  for (const { file, shard } of nameToTarget.values()) {
    if (!byShardRoot.has(shard.root)) byShardRoot.set(shard.root, { shard, files: new Set() });
    byShardRoot.get(shard.root).files.add(file);
  }
  if (byShardRoot.size === 0) return { recovered: [], retriedFiles: [] };

  const retriedFiles = [...byShardRoot.values()].flatMap(({ shard, files }) => [...files].map((f) => `${shard.root}/${f}`)).sort();
  console.log(
    `\n⟳ flake retry: re-running ${retriedFiles.length} test file(s) containing newly-failing tests ` +
      `(single retry — a real regression fails twice):`,
  );
  for (const file of retriedFiles) console.log(`  - ${file}`);

  const retryFailing = new Set();
  for (const { shard, files } of byShardRoot.values()) {
    const { xml } = runBunTestShard({ root: shard.root, filters: [...files].sort() });
    if (xml == null) continue;
    for (const name of failingTestNamesFromJUnit(xml)) retryFailing.add(name);
  }

  const recovered = newlyFailing.filter((name) => nameToTarget.has(name) && !retryFailing.has(name));
  return { recovered, retriedFiles };
}

function main() {
  const forwardedArgs = process.argv.slice(2);
  const { shards, flags } = planTestShards(forwardedArgs, { appShards: discoverAppShards() });

  const runs = runShards(shards, flags);
  const actualFailing = [...new Set(runs.flatMap(({ xml }) => failingTestNamesFromJUnit(xml)))];
  const knownEntries = normalizeKnownFailureEntries(JSON.parse(readFileSync(KNOWN_FAILURES_PATH, "utf8")));
  const knownFailing = knownEntries.map((entry) => entry.name);

  let buckets = bucketTestResults(actualFailing, knownFailing);

  if (buckets.newlyFailing.length > 0) {
    const { recovered, retriedFiles } = retryNewlyFailing({
      runs,
      newlyFailing: buckets.newlyFailing,
    });
    if (retriedFiles.length > 0) {
      if (recovered.length > 0) {
        console.log(`\n⟳ ${recovered.length} test(s) recovered on retry (flaky, not counted as regressions):`);
        for (const name of recovered) console.log(`  - ${name}`);
      } else {
        console.log("\n⟳ no tests recovered on retry — the failures are real.");
      }
      const recoveredSet = new Set(recovered);
      buckets = bucketTestResults(
        actualFailing.filter((name) => !recoveredSet.has(name)),
        knownFailing,
      );
    }
  }

  reportStaleBugEntries(knownEntries);

  console.log("");
  console.log(formatTestResultsReport(buckets));

  process.exit(buckets.ok ? 0 : 1);
}

function reportStaleBugEntries(knownEntries) {
  const stale = staleBugEntries(knownEntries, { maxAgeDays: BUG_ENTRY_MAX_AGE_DAYS });
  if (stale.length === 0) return;
  console.warn(
    `\n⚠ ${stale.length} known-failure entr${stale.length === 1 ? "y" : "ies"} of kind "bug" ` +
      `older than ${BUG_ENTRY_MAX_AGE_DAYS} days in tools/known-test-failures.json — these are parked product ` +
      `defects, not accepted behavior; fix them or re-justify their notes:`,
  );
  for (const entry of stale) {
    console.warn(`  - ${entry.name} (added ${entry.addedAt}, ${entry.ageDays} days ago)`);
  }
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

function reportSuiteCollectionMismatch(shardRoot, xml, consoleFailCount) {
  if (consoleFailCount == null) return;
  const xmlFailCount = failingTestNamesFromJUnit(xml).length;
  if (consoleFailCount > xmlFailCount) {
    console.warn(
      `\n⚠ bun test (shard ${shardRoot}) reported ${consoleFailCount} failing test(s) but only ${xmlFailCount} appear as failing ` +
        `<testcase> entries in the JUnit report. This usually means a test file crashed before bun could ` +
        `collect any tests in it (invisible to name-based comparison) — check the console output above for ` +
        `files that errored outside of a testcase, e.g. "Unhandled error between tests".`,
    );
  }
}

main();
