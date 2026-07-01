import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, readdirSync, statSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, sep } from "node:path";

// Shared mechanics for the "parity oracle" golden tests under apps/factory/tests/.
//
// Each oracle: makes an OS tmpdir workspace, writes fixture files into it, runs a
// factory CLI script against it via execFileSync, snapshots (some subset of) the
// output directory into a plain object/string, then compares that snapshot against
// a committed golden file (or, under an update-golden env var, overwrites the golden).
//
// The 4 call sites differ in: which CLI script + args to run, what fixture setup they
// need beforehand, which output subdirectory to snapshot (or whether they read named
// files instead of walking a directory at all), whether/how they mask non-deterministic
// substrings (timestamps) before comparing, which env var (if any) triggers golden
// regeneration, and whether they clean up the tmpdir afterward. This module only
// factors out the parts that are identical in spirit across call sites; per-file
// fixture-setup specifics stay inline in each test file.

/**
 * Recursively walk `dir` and return a snapshot object mapping each file's path
 * (relative to `base`, forward-slash-separated) to its UTF-8 contents, with an
 * optional regex replaced out of every file's contents first (for masking
 * non-deterministic values like ISO-8601 timestamps).
 *
 * @param {string} dir - directory to walk (recursively)
 * @param {object} [options]
 * @param {string} [options.base] - base directory paths are made relative to (defaults to `dir`)
 * @param {RegExp} [options.mask] - a global regex matched against each file's contents
 * @param {string} [options.maskWith] - replacement string used for `mask` matches (default "<TS>")
 * @returns {Record<string, string>} snapshot object, insertion order = sorted directory walk order
 */
export function walkAndSnapshot(dir, { base = dir, mask, maskWith = "<TS>" } = {}) {
  const out = {};
  const walk = (current) => {
    for (const name of readdirSync(current).sort()) {
      const abs = join(current, name);
      if (statSync(abs).isDirectory()) {
        walk(abs);
      } else {
        const rel = relative(base, abs).split(sep).join("/");
        const contents = readFileSync(abs, "utf8");
        out[rel] = mask ? contents.replace(mask, maskWith) : contents;
      }
    }
  };
  walk(dir);
  return out;
}

/**
 * Serialize a snapshot object (as produced by walkAndSnapshot) to a JSON string with
 * stable (sorted) key order, so the result is independent of filesystem walk order.
 */
export function stableSnapshotJson(snapshotObj) {
  return JSON.stringify(snapshotObj, Object.keys(snapshotObj).sort(), 2);
}

/**
 * Run a full golden-oracle cycle:
 *   1. mkdtemp a fresh OS tmpdir workspace (prefix `tmpPrefix`)
 *   2. call `setupFixture(ws)` to populate it with whatever fixture files the CLI needs
 *   3. execFileSync(command, args(ws), { stdio: "ignore", env: env(ws) })
 *   4. call `snapshot(ws)` to produce the value to compare (string or object)
 *   5. optionally rmSync the workspace (cleanup: true by default)
 *   6. return the snapshot value (comparison against the golden is left to the caller,
 *      since the 4 call sites use different assertion styles: toBe on a JSON string,
 *      toEqual on a parsed object, or per-key test.each over named files)
 *
 * @param {object} opts
 * @param {string} opts.tmpPrefix - mkdtemp prefix, e.g. "ge-cloud-data-golden-"
 * @param {(ws: string) => void} [opts.setupFixture] - populate the workspace before exec
 * @param {string} opts.command - executable to run (e.g. "node")
 * @param {(ws: string) => string[]} opts.args - argv (excluding command) given the workspace path
 * @param {(ws: string) => NodeJS.ProcessEnv} [opts.env] - env for the child process (defaults to process.env)
 * @param {(ws: string) => any} opts.snapshot - produce the snapshot value from the workspace after exec
 * @param {boolean} [opts.cleanup] - rmSync the workspace afterward (default true)
 * @returns {any} whatever `snapshot(ws)` returned
 */
export function runGoldenOracle({ tmpPrefix, setupFixture, command, args, env, snapshot, cleanup = true }) {
  const ws = mkdtempSync(join(tmpdir(), tmpPrefix));
  try {
    if (setupFixture) setupFixture(ws);
    execFileSync(command, args(ws), { stdio: "ignore", env: env ? env(ws) : process.env });
    return snapshot(ws);
  } finally {
    if (cleanup) rmSync(ws, { recursive: true, force: true });
  }
}

/**
 * Compare-or-update a golden file against a computed snapshot string.
 *
 * If `process.env[updateEnvVar] === "1"`, writes `snap` to `goldenPath` (creating/
 * overwriting it) instead of comparing. Otherwise reads the existing golden and
 * returns { snap, golden } for the caller to assert equality on (kept as a plain
 * return rather than asserting here, since call sites use different expect() styles).
 *
 * @param {object} opts
 * @param {string} opts.snap - the freshly computed snapshot (already serialized to a string)
 * @param {string} opts.goldenPath - path to the committed golden file
 * @param {string} [opts.updateEnvVar] - env var name that triggers regeneration (default "GE_UPDATE_GOLDEN")
 * @returns {{ snap: string, golden: string | undefined, updated: boolean }}
 */
export function compareOrUpdateGolden({ snap, goldenPath, updateEnvVar = "GE_UPDATE_GOLDEN" }) {
  if (process.env[updateEnvVar] === "1") {
    writeFileSync(goldenPath, snap);
    return { snap, golden: undefined, updated: true };
  }
  const golden = readFileSync(goldenPath, "utf8");
  return { snap, golden, updated: false };
}
