// Parses `bun test --reporter=junit` XML output and buckets failures against a
// checked-in known-failures list, so "judge by the set of failing test names"
// (see AGENTS.md) becomes a structural comparison instead of manual cross-referencing.
//
// bun's JUnit reporter nests one <testsuite> per file, then one <testsuite> per
// describe() block (only one level deep in this repo's test files), with
// <testcase classname="..." name="..."> leaves. `classname` is the describe-block
// name, or "" for a top-level test(). We render the full name the same way the
// prose in AGENTS.md lists them: "<classname> > <name>" when classname is
// non-empty, otherwise just "<name>".
//
// Known limitation: if a test *file* throws before bun can collect any tests in
// it (e.g. a `describe()`/`test()` nesting crash), bun's JUnit reporter omits
// that file's <testsuite> entirely — there is no <testcase> to report as failed.
// Such files are invisible to name-based comparison here. callCheckTestResults
// cross-checks the subprocess's own "X fail" summary line against the count of
// <failure>/<error> testcases found in the XML and surfaces a warning (not a
// hard failure) when they disagree, so this blind spot is at least visible.

import { readFileSync } from "node:fs";

/**
 * Extract every <testcase> element's attributes and whether it failed/errored,
 * from raw JUnit XML text. Deliberately a small regex-based walk rather than a
 * full XML parser/dependency: bun's reporter output is simple, single-line
 * attribute lists per tag, and we only need a handful of fields.
 *
 * @param {string} xml
 * @returns {{ name: string, classname: string, failed: boolean }[]}
 */
export function parseJUnitTestcases(xml) {
  const cases = [];
  // Match each <testcase ...>...</testcase> or self-closing <testcase ... />.
  const testcaseRe = /<testcase\b([^>]*?)(\/>|>([\s\S]*?)<\/testcase>)/g;
  let match;
  while ((match = testcaseRe.exec(xml)) !== null) {
    const attrs = match[1];
    const body = match[3] ?? "";
    const name = extractAttr(attrs, "name");
    const classname = extractAttr(attrs, "classname") ?? "";
    if (name == null) continue;
    const failed = /<failure\b/.test(body) || /<error\b/.test(body);
    const file = extractAttr(attrs, "file");
    cases.push({
      name: decodeXmlEntities(name),
      classname: decodeXmlEntities(classname),
      failed,
      // bun's reporter emits the test file path (repo-relative) on every
      // <testcase>; used to re-run just the failing files on the flake retry.
      file: file == null ? null : decodeXmlEntities(file),
    });
  }
  return cases;
}

function extractAttr(attrString, attrName) {
  const re = new RegExp(`\\b${attrName}="([^"]*)"`);
  const m = re.exec(attrString);
  return m ? m[1] : null;
}

function decodeXmlEntities(value) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

/**
 * Full display name for a testcase, matching the "describe > test" convention
 * used in AGENTS.md's prose list of known failures.
 * @param {{ name: string, classname: string }} testcase
 */
export function fullTestName({ name, classname }) {
  return classname ? `${classname} > ${name}` : name;
}

/**
 * Parse JUnit XML text and return the set of full names of every testcase that
 * failed or errored.
 * @param {string} xml
 * @returns {string[]}
 */
export function failingTestNamesFromJUnit(xml) {
  return parseJUnitTestcases(xml)
    .filter((tc) => tc.failed)
    .map(fullTestName);
}

/**
 * Read a JUnit XML file and return the set of full names of every testcase
 * that failed or errored.
 * @param {string} path
 * @returns {string[]}
 */
export function failingTestNamesFromJUnitFile(path) {
  return failingTestNamesFromJUnit(readFileSync(path, "utf8"));
}

/**
 * Parse JUnit XML text and return every failed/errored testcase as
 * { name: fullName, file: repo-relative test file path or null }.
 * The file attribution is what lets the checker re-run only the test files
 * containing newly-failing names on its single flake retry.
 * @param {string} xml
 * @returns {{ name: string, file: string | null }[]}
 */
export function failingTestcasesFromJUnit(xml) {
  return parseJUnitTestcases(xml)
    .filter((tc) => tc.failed)
    .map((tc) => ({ name: fullTestName(tc), file: tc.file }));
}

/**
 * Normalize the checked-in known-failures document. Entries are objects
 * ({ name, kind: "env" | "bug", addedAt: "YYYY-MM-DD", notes }); bare strings
 * are tolerated for backward compatibility and normalized to an entry with
 * null metadata.
 *
 * @param {{ failures?: (string | { name: string, kind?: string, addedAt?: string, notes?: string })[] }} known
 * @returns {{ name: string, kind: string | null, addedAt: string | null, notes: string | null }[]}
 */
export function normalizeKnownFailureEntries(known) {
  return (known?.failures ?? []).map((entry) =>
    typeof entry === "string"
      ? { name: entry, kind: null, addedAt: null, notes: null }
      : { name: entry.name, kind: entry.kind ?? null, addedAt: entry.addedAt ?? null, notes: entry.notes ?? null },
  );
}

/**
 * Known-failure entries of kind "bug" that have been parked in the baseline
 * longer than `maxAgeDays` (default 30). A "bug" entry is a real product
 * defect deliberately not gating unrelated work — aging it out loudly is the
 * expiry mechanism that keeps this list from becoming accepted behavior.
 *
 * @param {ReturnType<typeof normalizeKnownFailureEntries>} entries
 * @param {{ now?: Date, maxAgeDays?: number }} [options]
 * @returns {{ name: string, addedAt: string, ageDays: number }[]}
 */
export function staleBugEntries(entries, { now = new Date(), maxAgeDays = 30 } = {}) {
  const stale = [];
  for (const entry of entries) {
    if (entry.kind !== "bug" || !entry.addedAt) continue;
    const added = new Date(entry.addedAt);
    if (Number.isNaN(added.getTime())) continue;
    const ageDays = Math.floor((now.getTime() - added.getTime()) / 86_400_000);
    if (ageDays > maxAgeDays) stale.push({ name: entry.name, addedAt: entry.addedAt, ageDays });
  }
  return stale;
}

/**
 * Compare the actual failing-test-name set against a known-failures baseline.
 *
 * @param {string[]} actualFailing - full names of tests failing in this run.
 * @param {string[]} knownFailing - checked-in baseline of accepted failures.
 * @returns {{
 *   newlyFailing: string[],
 *   stillFailing: string[],
 *   nowPassing: string[],
 *   ok: boolean,
 * }}
 */
export function bucketTestResults(actualFailing, knownFailing) {
  const actualSet = new Set(actualFailing);
  const knownSet = new Set(knownFailing);

  const newlyFailing = actualFailing.filter((name) => !knownSet.has(name)).sort();
  const stillFailing = actualFailing.filter((name) => knownSet.has(name)).sort();
  const nowPassing = knownFailing.filter((name) => !actualSet.has(name)).sort();

  return {
    newlyFailing,
    stillFailing,
    nowPassing,
    ok: newlyFailing.length === 0,
  };
}

/**
 * Plan the per-directory shards for a gated test run.
 *
 * Why shards exist at all: `bun test` scans every file under its cwd before
 * filtering, and a repo-root scan (~30k files once the okf/ corpus and
 * generated-agents/ are counted) exceeds a 4096 file-descriptor rlimit — the
 * kind sandboxed/containerized runners commonly pin — killing the run with
 * EMFILE before a single test executes. Running one `bun test` per top-level
 * directory (and per app, which also isolates cross-app module-mock leakage
 * like bun's process-global mock.module) keeps each scan a few thousand files.
 *
 * @param {string[]} args - argv forwarded to the checker: path filters and/or
 *   `-`-prefixed flags. Paths map onto their owning shard: `apps/factory/x` →
 *   shard `apps/factory` with filter `x`; `tools/lib/y.test.mjs` → shard
 *   `tools` with filter `lib/y.test.mjs`. A path that doesn't start with a
 *   known shard root falls back to a repo-root shard (previous behavior).
 * @param {{ appShards: string[] }} options - shard roots under apps/
 *   (e.g. ["apps/console", "apps/factory"]), enumerated by the caller.
 * @returns {{ shards: { root: string, filters: string[] }[], flags: string[] }}
 *   `root` is repo-relative ("." = repo root); an empty `filters` means the
 *   whole shard.
 */
export function planTestShards(args, { appShards }) {
  const flags = args.filter((arg) => arg.startsWith("-"));
  const paths = args
    .filter((arg) => !arg.startsWith("-"))
    .map((arg) => arg.replace(/^\.\//, "").replace(/\/+$/, ""));

  if (paths.length === 0) {
    return {
      shards: [...appShards, "tools", "packages"].map((root) => ({ root, filters: [] })),
      flags,
    };
  }

  // shard root -> filter list; a null in the list means "the whole shard".
  const byRoot = new Map();
  const add = (root, filter) => {
    if (!byRoot.has(root)) byRoot.set(root, []);
    byRoot.get(root).push(filter);
  };
  for (const path of paths) {
    const segments = path.split("/");
    if (segments[0] === "apps") {
      if (segments.length === 1) for (const root of appShards) add(root, null);
      else add(`apps/${segments[1]}`, segments.slice(2).join("/") || null);
    } else if (segments[0] === "tools" || segments[0] === "packages") {
      add(segments[0], segments.slice(1).join("/") || null);
    } else {
      add(".", path);
    }
  }

  const shards = [...byRoot.entries()].map(([root, filters]) => ({
    root,
    filters: filters.includes(null) ? [] : filters,
  }));
  return { shards, flags };
}

/**
 * Render a human-readable report for the three buckets.
 * @param {ReturnType<typeof bucketTestResults>} buckets
 */
export function formatTestResultsReport(buckets) {
  const lines = [];

  if (buckets.newlyFailing.length > 0) {
    lines.push(`✗ ${buckets.newlyFailing.length} newly failing test(s) (regressions — not in known-test-failures.json):`);
    for (const name of buckets.newlyFailing) lines.push(`  - ${name}`);
  } else {
    lines.push("✓ no newly failing tests");
  }

  lines.push("");
  lines.push(`ℹ ${buckets.stillFailing.length} known-failing test(s) still failing (accepted baseline, not a gate failure):`);
  for (const name of buckets.stillFailing) lines.push(`  - ${name}`);

  if (buckets.nowPassing.length > 0) {
    lines.push("");
    lines.push(
      `⚠ ${buckets.nowPassing.length} known-failing test(s) are now passing — tools/known-test-failures.json is stale. ` +
        `A human should decide whether to trim these entries or investigate why they started passing:`,
    );
    for (const name of buckets.nowPassing) lines.push(`  - ${name}`);
  }

  return lines.join("\n");
}
