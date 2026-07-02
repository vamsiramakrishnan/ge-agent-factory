// tools/lib/daemon/command-run.mjs — the "ge.command" and "process.command"
// run-kinds: spawn an allowlisted `ge <argv>` invocation or a whitelisted
// repo-local script/uv command and stream its output as daemon events. Moved
// verbatim out of tools/lib/runtime-daemon.mjs. Also owns the safe-to-rerun
// classifiers (safeGeCommand/safeProcessCommand) and the PATH/env augmentation
// helpers (toolAugmentedPath/runtimeEnv) that the mission-node-command
// run-kind reuses for its own uv/node process spawns.
import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { execStream } from "../exec-stream.mjs";
import { REPO_ROOT, STATE_PATHS } from "../state-paths.mjs";
import {
  appendEvent,
  appendResumeAttempt,
  commandOutput,
  createRun,
  newTaskId,
  runOutput,
  terminalStatusForCode,
  updateRun,
} from "./run-store.mjs";

const GE_CLI = join(REPO_ROOT, "tools", "ge.mjs");
const DEFAULT_UV_CACHE_DIR = STATE_PATHS.cache.uv;

export function safeGeCommand(argv = []) {
  const args = Array.isArray(argv) ? argv.map(String) : [];
  const [noun, verb] = args;
  if (noun === "doctor") return true;
  if (noun === "config" && verb === "explain") return true;
  if (noun === "daemon" && ["status", "tasks", "task", "events"].includes(verb)) return true;
  if (noun === "runtime" && ["status", "tasks", "task", "events"].includes(verb)) return true;
  if (noun === "autopilot" && ["status", "events"].includes(verb)) return true;
  if (noun === "agents" && ["status", "logs"].includes(verb)) return true;
  if (noun === "data" && verb === "doctor") return true;
  if (noun === "mcp" && verb === "doctor") return true;
  return false;
}

export function safeProcessCommand(argv = []) {
  const args = Array.isArray(argv) ? argv.map(String).filter(Boolean) : [];
  const [cmd, script] = args;
  if (!cmd || !script) return false;
  if (cmd === "uv" && script === "run" && args.includes("--with") && args.includes("snowfakery") && args.includes("setuptools<81")) {
    const toolIndex = args.lastIndexOf("snowfakery");
    const recipe = toolIndex >= 0 ? args[toolIndex + 1] : null;
    const outputIndex = args.indexOf("--output-folder");
    return String(recipe || "").endsWith("mock_data/snowfakery/structured.recipe.yml")
      && outputIndex > 0
      && String(args[outputIndex + 1] || "").endsWith("mock_data/snowfakery/output");
  }
  if (cmd !== "node" && cmd !== process.execPath) return false;
  const allowedScripts = [
    "apps/factory/scripts/plan-mock-data.mjs",
    "apps/factory/scripts/materialize-simulator-seeds.mjs",
    "apps/factory/scripts/validate-simulator-pack.mjs",
  ];
  return allowedScripts.some((allowed) => script === allowed || script.endsWith(`/${allowed}`));
}

// Tool dirs where uv / node / gcloud commonly live but which a daemon launched from a minimal
// environment (GUI, launchd, systemd, an IDE) may NOT have on PATH. Spawned commands like
// `uv run --with snowfakery snowfakery …` then fail with a cryptic ENOENT surfaced as "exit 1"
// (the binary, not the recipe, is the problem). Ensure these are on PATH for every spawned command.
export function toolAugmentedPath(env = process.env) {
  const sep = process.platform === "win32" ? ";" : ":";
  const merged = String(env.PATH || "").split(sep).filter(Boolean);
  const extra = [
    join(homedir(), ".local", "bin"),
    join(homedir(), ".cargo", "bin"),
    "/usr/local/bin",
    "/opt/homebrew/bin",
  ];
  for (const dir of extra) if (dir && !merged.includes(dir)) merged.push(dir);
  return merged.join(sep);
}

export function runtimeEnv(extra = {}) {
  mkdirSync(DEFAULT_UV_CACHE_DIR, { recursive: true });
  return {
    ...process.env,
    PATH: toolAugmentedPath(process.env),
    UV_CACHE_DIR: process.env.UV_CACHE_DIR || DEFAULT_UV_CACHE_DIR,
    CLOUDSDK_CORE_DISABLE_PROMPTS: "1",
    ...extra,
  };
}

export function startGeCommandTask({ argv = [], command = null } = {}) {
  const safeArgv = Array.isArray(argv) ? argv.map(String).filter(Boolean) : [];
  if (!safeArgv.length) throw new Error("argv is required");
  const run = createRun({
    id: newTaskId("job"),
    kind: "ge.command",
    input: { argv: safeArgv, command },
  });
  appendEvent(run.id, { type: "stage_started", stage: "job", line: `$ ge ${safeArgv.join(" ")}` });

  execStream(process.execPath, [GE_CLI, ...safeArgv], {
    cwd: REPO_ROOT,
    env: { ...process.env, CLOUDSDK_CORE_DISABLE_PROMPTS: "1" },
    meta: { runId: run.id, stage: "job" },
    onEvent: (event) => appendEvent(run.id, event),
  }).then((result) => {
    const status = terminalStatusForCode(result.code);
    const line = `exit ${result.code}`;
    appendEvent(run.id, {
      type: status === "done" ? "stage_done" : "stage_failed",
      stage: "job",
      level: status === "done" ? "info" : "error",
      line,
      data: { code: result.code, signal: result.signal || null },
    });
    updateRun(run.id, { status, code: result.code, endedAt: new Date().toISOString(), output: commandOutput(result, { preserveMachineStdout: true }) });
  }).catch((error) => {
    const line = error?.message || String(error);
    appendEvent(run.id, { type: "stage_failed", stage: "job", level: "error", line });
    updateRun(run.id, { status: "failed", code: 1, endedAt: new Date().toISOString(), error: line });
  });

  return run;
}

export function startProcessCommandTask({ argv = [], command = null } = {}) {
  const safeArgv = Array.isArray(argv) ? argv.map(String).filter(Boolean) : [];
  if (!safeArgv.length) throw new Error("argv is required");
  if (!safeProcessCommand(safeArgv)) throw new Error("process command is not classified safe to run");
  const cmd = safeArgv[0] === "node" ? process.execPath : safeArgv[0];
  const args = safeArgv.slice(1);
  const run = createRun({
    id: newTaskId("proc"),
    kind: "process.command",
    input: { argv: safeArgv, command },
  });
  appendEvent(run.id, { type: "stage_started", stage: "process", line: `$ ${safeArgv.join(" ")}` });

  execStream(cmd, args, {
    cwd: REPO_ROOT,
    env: runtimeEnv(),
    meta: { runId: run.id, stage: "process" },
    onEvent: (event) => appendEvent(run.id, event),
  }).then((result) => {
    const status = terminalStatusForCode(result.code);
    const line = `exit ${result.code}`;
    appendEvent(run.id, {
      type: status === "done" ? "stage_done" : "stage_failed",
      stage: "process",
      level: status === "done" ? "info" : "error",
      line,
      data: { code: result.code, signal: result.signal || null },
    });
    updateRun(run.id, { status, code: result.code, endedAt: new Date().toISOString(), output: commandOutput(result, { preserveMachineStdout: true }) });
  }).catch((error) => {
    const line = error?.message || String(error);
    appendEvent(run.id, { type: "stage_failed", stage: "process", level: "error", line });
    updateRun(run.id, { status: "failed", code: 1, endedAt: new Date().toISOString(), error: line });
  });

  return run;
}

export function resumeGeCommandTask(run) {
  const argv = Array.isArray(run.input?.argv) ? run.input.argv.map(String).filter(Boolean) : [];
  if (!argv.length) throw new Error("stored argv is empty");
  updateRun(run.id, { status: "running", endedAt: null, error: null });
  appendEvent(run.id, { type: "stage_started", stage: "job", line: `$ ge ${argv.join(" ")} (resume)` });
  execStream(process.execPath, [GE_CLI, ...argv], {
    cwd: REPO_ROOT,
    env: { ...process.env, CLOUDSDK_CORE_DISABLE_PROMPTS: "1" },
    meta: { runId: run.id, stage: "job" },
    onEvent: (event) => appendEvent(run.id, event),
  }).then((result) => {
    const status = terminalStatusForCode(result.code);
    appendEvent(run.id, {
      type: status === "done" ? "resume_done" : "resume_failed",
      stage: "job",
      level: status === "done" ? "info" : "error",
      line: `exit ${result.code}`,
      data: { code: result.code, signal: result.signal || null },
    });
    appendResumeAttempt(run.id, { status, action: "rerun_command", code: result.code });
    updateRun(run.id, { status, code: result.code, endedAt: new Date().toISOString(), output: { ...runOutput(run.id), ...commandOutput(result, { preserveMachineStdout: true }) } });
  }).catch((error) => {
    const line = error?.message || String(error);
    appendEvent(run.id, { type: "resume_failed", stage: "job", level: "error", line });
    appendResumeAttempt(run.id, { status: "failed", action: "rerun_command", error: line });
    updateRun(run.id, { status: "failed", code: 1, endedAt: new Date().toISOString(), error: line });
  });
}

export function resumeProcessCommandTask(run) {
  const argv = Array.isArray(run.input?.argv) ? run.input.argv.map(String).filter(Boolean) : [];
  if (!argv.length) throw new Error("stored argv is empty");
  const cmd = argv[0] === "node" ? process.execPath : argv[0];
  const args = argv.slice(1);
  updateRun(run.id, { status: "running", endedAt: null, error: null });
  appendEvent(run.id, { type: "stage_started", stage: "process", line: `$ ${argv.join(" ")} (resume)` });
  execStream(cmd, args, {
    cwd: REPO_ROOT,
    env: runtimeEnv(),
    meta: { runId: run.id, stage: "process" },
    onEvent: (event) => appendEvent(run.id, event),
  }).then((result) => {
    const status = terminalStatusForCode(result.code);
    appendEvent(run.id, {
      type: status === "done" ? "resume_done" : "resume_failed",
      stage: "process",
      level: status === "done" ? "info" : "error",
      line: `exit ${result.code}`,
      data: { code: result.code, signal: result.signal || null },
    });
    appendResumeAttempt(run.id, { status, action: "rerun_process", code: result.code });
    updateRun(run.id, { status, code: result.code, endedAt: new Date().toISOString(), output: { ...runOutput(run.id), ...commandOutput(result, { preserveMachineStdout: true }) } });
  }).catch((error) => {
    const line = error?.message || String(error);
    appendEvent(run.id, { type: "resume_failed", stage: "process", level: "error", line });
    appendResumeAttempt(run.id, { status: "failed", action: "rerun_process", error: line });
    updateRun(run.id, { status: "failed", code: 1, endedAt: new Date().toISOString(), error: line });
  });
}
