// tools/lib/daemon/command-run.mjs — the "ge.command" and "process.command"
// run-kinds: spawn an allowlisted `ge <argv>` invocation or a whitelisted
// repo-local script/uv command and stream its output as daemon events. Moved
// verbatim out of tools/lib/runtime-daemon.mjs. Also owns the safe-to-rerun
// classifiers (safeGeCommand/safeProcessCommand) and the PATH/env augmentation
// helpers (toolAugmentedPath/runtimeEnv) that the pipeline-node-command
// run-kind reuses for its own uv/node process spawns.
import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { REPO_ROOT, STATE_PATHS } from "../state-paths.mjs";
import { runStreamedTask } from "./task-runner.mjs";
import { createRun, newTaskId } from "./run-store.mjs";

const GE_CLI = join(REPO_ROOT, "tools", "ge.mjs");
const DEFAULT_UV_CACHE_DIR = STATE_PATHS.cache.uv;

export function safeGeCommand(argv = []) {
  const args = Array.isArray(argv) ? argv.map(String) : [];
  const [noun, verb] = args;
  if (noun === "doctor") return true;
  if (noun === "config" && verb === "explain") return true;
  if (noun === "daemon" && ["status", "tasks", "task", "events"].includes(verb)) return true;
  if (noun === "runs" && ["list", "show", "events"].includes(verb)) return true;
  if (noun === "fleet" && ["status", "repairs"].includes(verb)) return true;
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

// Shared execution shape for both command kinds; only argv validation, spawn
// target, env, and event stage differ. The orchestration skeleton (events,
// exit mapping, resume attempts, output merge) lives in task-runner.mjs.
function geCommandExecution(argv) {
  return {
    stage: "job",
    startLine: `$ ge ${argv.join(" ")}`,
    cmd: process.execPath,
    args: [GE_CLI, ...argv],
    env: { ...process.env, CLOUDSDK_CORE_DISABLE_PROMPTS: "1" },
  };
}

function processCommandExecution(argv) {
  return {
    stage: "process",
    startLine: `$ ${argv.join(" ")}`,
    cmd: argv[0] === "node" ? process.execPath : argv[0],
    args: argv.slice(1),
    env: runtimeEnv(),
  };
}

function requireArgv(argv, message) {
  const safeArgv = Array.isArray(argv) ? argv.map(String).filter(Boolean) : [];
  if (!safeArgv.length) throw new Error(message);
  return safeArgv;
}

export function startGeCommandTask({ argv = [], command = null } = {}) {
  const safeArgv = requireArgv(argv, "argv is required");
  const run = createRun({ id: newTaskId("job"), kind: "ge.command", input: { argv: safeArgv, command } });
  return runStreamedTask({ run, ...geCommandExecution(safeArgv) });
}

export function startProcessCommandTask({ argv = [], command = null } = {}) {
  const safeArgv = requireArgv(argv, "argv is required");
  if (!safeProcessCommand(safeArgv)) throw new Error("process command is not classified safe to run");
  const run = createRun({ id: newTaskId("proc"), kind: "process.command", input: { argv: safeArgv, command } });
  return runStreamedTask({ run, ...processCommandExecution(safeArgv) });
}

export function resumeGeCommandTask(run) {
  const argv = requireArgv(run.input?.argv, "stored argv is empty");
  runStreamedTask({ run, resume: true, resumeAction: "rerun_command", ...geCommandExecution(argv) });
}

export function resumeProcessCommandTask(run) {
  const argv = requireArgv(run.input?.argv, "stored argv is empty");
  runStreamedTask({ run, resume: true, resumeAction: "rerun_process", ...processCommandExecution(argv) });
}
