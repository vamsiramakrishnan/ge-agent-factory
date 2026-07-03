// tools/lib/daemon/run-store.mjs — the filesystem-backed run store shared by
// every runtime-daemon run-kind (ge-command, process-command, doctor,
// harness-run, pipeline-node-command, repair, pipeline-graph). Moved
// verbatim out of tools/lib/runtime-daemon.mjs: these are pure
// read/write-a-JSON-file-per-run-id primitives with no knowledge of any
// specific run-kind, so they're the natural leaf layer every run-kind module
// imports from (one-way — this file must never import a run-kind module).
import { existsSync, mkdirSync, readFileSync, appendFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { readJson, writeJson } from "@ge/std/json-io";
import { ensureStateLayout, STATE_PATHS } from "../state-paths.mjs";

const RUNS_DIR = STATE_PATHS.runtime.runs;

export function ensureStore() {
  ensureStateLayout();
  mkdirSync(RUNS_DIR, { recursive: true });
}

// readJson/writeJson come from the shared atomic json-io helper (see import above).

export function runDir(id) {
  return join(RUNS_DIR, id);
}

export function runMetaPath(id) {
  return join(runDir(id), "run.json");
}

export function runEventsPath(id) {
  return join(runDir(id), "events.jsonl");
}

export function interactionDir(id) {
  return join(runDir(id), "interactions");
}

export function newTaskId(prefix) {
  return `${prefix}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
}

export function appendEvent(id, event) {
  const ev = { ts: new Date().toISOString(), ...event };
  appendFileSync(runEventsPath(id), JSON.stringify(ev) + "\n", "utf8");
  return ev;
}

export function listEvents(id) {
  const path = runEventsPath(id);
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8").split("\n").filter(Boolean).map((line) => {
    try { return JSON.parse(line); } catch { return null; }
  }).filter(Boolean);
}

export function listSequencedEvents(id) {
  return listEvents(id).map((event, index) => ({ seq: index + 1, event }));
}

export function taskStatusState(status) {
  if (status === "done") return "done";
  if (status === "skipped") return "skipped";
  if (["blocked", "failed"].includes(status)) return "blocked";
  if (status === "paused") return "paused";
  if (["running", "queued"].includes(status)) return "running";
  return status || "blocked";
}

export function updateRun(id, patch) {
  const current = readJson(runMetaPath(id), {});
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  writeJson(runMetaPath(id), next);
  return next;
}

export function readdirSafe(path) {
  try {
    return existsSync(path)
      ? readdirSync(path, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)
      : [];
  } catch {
    return [];
  }
}

export function listRuns(limit = 50) {
  return existsSync(RUNS_DIR)
    ? readdirSafe(RUNS_DIR)
      .map((id) => readJson(runMetaPath(id), null))
      .filter(Boolean)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .slice(0, Math.max(1, Math.min(Number(limit) || 50, 200)))
    : [];
}

export function createRun({ id = newTaskId("task"), kind, input = {}, status = "running" }) {
  ensureStore();
  mkdirSync(runDir(id), { recursive: true });
  const run = {
    id,
    kind,
    status,
    input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    endedAt: null,
  };
  writeJson(runMetaPath(id), run);
  return run;
}

export function runOutput(id) {
  return readJson(runMetaPath(id), {}).output || {};
}

export function updateRunOutput(id, patch) {
  const current = readJson(runMetaPath(id), {});
  return updateRun(id, { output: { ...(current.output || {}), ...patch } });
}

export function appendResumeAttempt(id, patch) {
  const output = runOutput(id);
  const attempts = Array.isArray(output.resumeAttempts) ? output.resumeAttempts : [];
  updateRunOutput(id, { resumeAttempts: [...attempts, { ts: new Date().toISOString(), ...patch }] });
}

export function terminalStatusForCode(code) {
  return code === 0 ? "done" : "failed";
}

export function taskTerminal(run) {
  return run && !["running", "queued"].includes(run.status);
}

export function waitForTaskTerminal(id, { intervalMs = 300, onEvent = null } = {}) {
  return new Promise((resolve) => {
    let sent = 0;
    const tick = () => {
      if (onEvent) {
        const events = listSequencedEvents(id);
        for (let i = sent; i < events.length; i += 1) onEvent(events[i]);
        sent = events.length;
      }
      const run = readJson(runMetaPath(id), null);
      if (taskTerminal(run)) {
        resolve(run);
        return;
      }
      setTimeout(tick, intervalMs);
    };
    tick();
  });
}

export function commandOutput(result = {}, { preserveMachineStdout = false } = {}) {
  const MAX_MACHINE_OUTPUT_BYTES = 2 * 1024 * 1024;
  const stdout = String(result.stdout || "");
  const stderr = String(result.stderr || "");
  return {
    stdout: stdout.slice(-4000),
    stderr: stderr.slice(-4000),
    ...(preserveMachineStdout ? { stdoutFull: stdout.slice(-MAX_MACHINE_OUTPUT_BYTES) } : {}),
  };
}
