#!/usr/bin/env node
// replay-smoke.mjs — the full live loop, entirely offline, against the
// checked-in success fixture: drive replay → record an evalset → prove live
// over the cassette → bench replay. Zero cloud calls, zero config; exits
// non-zero on the first failure.
//
//   node skills/driving-live-proof/scripts/replay-smoke.mjs
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const CASSETTE = "tools/lib/live/fixtures/success.ndjson";
const work = mkdtempSync(join(tmpdir(), "ge-replay-smoke-"));

function ge(step, args, expect) {
  process.stderr.write(`==> ${step}\n`);
  const result = spawnSync("bun", ["tools/ge.mjs", ...args, "--json"], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    // Keep all state (transcripts, baselines, proof artifacts) in the temp
    // dir so a smoke run never touches the operator's .ge tree.
    env: { ...process.env, GE_STATE_ROOT: join(work, "state") },
    stdio: ["ignore", "pipe", "inherit"],
  });
  if (result.status !== 0) {
    process.stderr.write(`${step} exited ${result.status}\n`);
    process.exit(1);
  }
  let parsed;
  try {
    parsed = JSON.parse(result.stdout);
  } catch {
    process.stderr.write(`${step} did not emit JSON\n`);
    process.exit(1);
  }
  if (!expect(parsed)) {
    process.stderr.write(`${step} did not pass\n`);
    process.exit(1);
  }
  return parsed;
}

try {
  const evalset = join(work, "recorded.evalset.json");
  ge(
    "drive: replay the cassette and record it as an evalset",
    ["drive", "--cassette", CASSETTE, "--record", evalset],
    (r) => r.ok === true,
  );
  ge(
    "prove --live: run the recorded case over the same cassette",
    ["prove", "--live", "--evalset", evalset, "--cassette", CASSETTE],
    (r) => r.status === "passed",
  );
  ge(
    "bench: replay the cassette against the default budgets",
    ["bench", "--cassette", CASSETTE],
    (r) => r.status === "passed",
  );
  process.stdout.write("replay smoke passed: drive ok, live proof passed, bench passed (zero cloud)\n");
} finally {
  rmSync(work, { recursive: true, force: true });
}
