import { test, expect } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { compareOrUpdateGolden } from "./golden-test-helpers.mjs";

// PARITY ORACLE for the startAgentRun decomposition (apps/factory/src/server.js).
//
// startAgentRun drives a live SSE HTTP response and spawns a real subprocess, so unlike
// the other *-golden.test.js oracles under this directory (which snapshot pure-computation
// file output), this one has to snapshot BEHAVIOR: the full ordered SSE event sequence
// sent to the client, the final run-status body, the on-disk run event log
// (workspace/runs/<id>/events.jsonl — the "evidence" startAgentRun records as it goes),
// and the workspace-command shim script it materializes into .ge-harness/bin/ before
// spawning. Any extraction that changes the shape, order, or content of any of these is a
// behavior regression and fails here.
//
// Driven via the bundled, credential-free "mock" agent (apps/factory/src/mock-agent.js,
// see AGENT_DEFS in src/agents.js) — a real spawned subprocess with real stdout/stderr/
// close wiring through the exact same code path a live gemini/claude/codex run would take,
// but with fully offline, deterministic canned output. No gcloud/ADK/agents-cli credential
// is required or contacted.
//
// Runs the oracle (fixtures/start-agent-run-sse/run-oracle.mjs) in a subprocess rather than
// in-process: apps/factory/src/state-paths.js resolves GENERATOR_DATA_ROOT /
// GENERATOR_WORKSPACES_ROOT once, at module-load time, from process.env.GE_HARNESS_DATA_ROOT.
// server.js and everything it imports (db.js, projects.js, ...) close over those resolved
// constants, and since bun caches ES modules per-process there's no way to get a second,
// differently-rooted data dir once server.js has been imported once in this process (e.g.
// by an earlier test file importing it against apps/factory/package.json's shared
// GE_HARNESS_DATA_ROOT). A fresh subprocess per run, pointed at its own throwaway mkdtemp
// dir, gives full isolation (project store + sqlite db + run dir) and reproducible ids.
//
// Non-deterministic substrings — the run's uuid, the spawned mock-agent child's pid, ISO/
// epoch timestamps, and the oracle's own mkdtemp workspace root — are masked out (by
// substituting the actual observed values, not blind regexes, since the run id and pid
// appear both escaped (inside JSON-encoded fields) and unescaped (in the raw SSE text) and
// a naive regex misses the escaped form) before comparing against the committed golden.
//
// To regenerate after an INTENTIONAL behavior change (review the diff before committing):
//   GE_UPDATE_GOLDEN=1 bun test apps/factory/tests/start-agent-run-sse-golden.test.js
const HERE = dirname(fileURLToPath(import.meta.url));
const RUNNER = join(HERE, "fixtures", "start-agent-run-sse", "run-oracle.mjs");
const GOLDEN_PATH = join(HERE, "fixtures", "start-agent-run-sse", "events.golden.json");

function runOracle() {
  const ws = mkdtempSync(join(tmpdir(), "ge-start-agent-run-sse-"));
  try {
    const stdout = execFileSync("bun", [RUNNER], {
      env: { ...process.env, GE_HARNESS_DATA_ROOT: ws },
      timeout: 20_000,
    }).toString("utf8");
    return maskNonDeterministic(JSON.parse(stdout), ws);
  } finally {
    rmSync(ws, { recursive: true, force: true });
  }
}

// Masks known non-deterministic values by substituting their ACTUAL observed value (not a
// blind pattern), then normalizes timestamps by pattern (their shape, not value, is what's
// stable). Applied to the raw (single-encoded) strings from run-oracle.mjs's JSON.parse, so
// there's no quote-escaping to work around.
function maskNonDeterministic(raw, workspaceRoot) {
  const runId = raw.runId;
  const pidMatch = raw.sse.match(/"pid":(\d+)/);
  const pid = pidMatch ? pidMatch[1] : null;

  const maskString = (value) => {
    let out = value;
    if (workspaceRoot) out = out.split(workspaceRoot).join("<WORKSPACE_ROOT>");
    if (runId) out = out.split(runId).join("<RUN_ID>");
    if (pid) out = out.split(`"pid":${pid}`).join(`"pid":"<PID>"`);
    out = out.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g, "<TS>");
    out = out.replace(/"createdAt":\d+/g, '"createdAt":"<TS_MS>"');
    out = out.replace(/"updatedAt":\d+/g, '"updatedAt":"<TS_MS>"');
    return out;
  };

  return {
    projectId: raw.projectId,
    sse: maskString(raw.sse),
    runStatus: JSON.parse(maskString(JSON.stringify(raw.runStatus))),
    eventsLog: maskString(raw.eventsLog),
    // Fully static (no cwd/timestamp/id embedded) — verifies
    // materializeWorkspaceCommandShims' on-disk side effect byte-for-byte.
    shimScript: raw.shimScript,
  };
}

test("startAgentRun SSE sequence and side effects are stable (parity oracle)", () => {
  const snap = JSON.stringify(runOracle(), null, 2);
  const { snap: got, golden, updated } = compareOrUpdateGolden({ snap, goldenPath: GOLDEN_PATH });
  if (updated) return;
  expect(got).toBe(golden);
}, 30_000);
