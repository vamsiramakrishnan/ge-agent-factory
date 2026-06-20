import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync, rmSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { homedir } from "node:os";
import * as core from "./factory-core.mjs";
import { readJson, writeJson } from "./json-io.mjs";
import { execStream } from "./exec-stream.mjs";
import {
  autopilotCounts,
  autopilotItemsFromMission,
  autopilotSkipReason,
  createAutopilotItemState,
  createAutopilotRunState,
  runAutopilotConvergence,
} from "./autopilot-runner.mjs";
import { verifyMissionArtifacts } from "./mission-artifacts.mjs";
import { isDataMissionNodeKind, missionNodeCommand, safeMissionNodeCommand, validateMissionNodeArtifacts } from "./mission-node-registry.mjs";
import { summarizeMissionNode } from "./mission-node-summary.mjs";
import { buildMissionGraph, nextRunnableMissionNode, patchMissionNode, resetMissionGraphForResume } from "./mission-plan.mjs";
import { normalizeRuntimeTask } from "./runtime-contract.mjs";
import { LEGACY_STATE_PATHS, REPO_ROOT, STATE_PATHS, ensureStateLayout } from "./state-paths.mjs";

const GE_CLI = join(REPO_ROOT, "tools", "ge.mjs");
const HARNESS_CLI = join(REPO_ROOT, "apps", "ge-demo-generator", "src", "cli.js");
const DAEMON_DIR = STATE_PATHS.runtime.root;
const RUNS_DIR = STATE_PATHS.runtime.runs;
const PID_PATH = STATE_PATHS.runtime.pid;
const META_PATH = STATE_PATHS.runtime.meta;
const LOG_PATH = STATE_PATHS.runtime.log;
const DEFAULT_UV_CACHE_DIR = STATE_PATHS.cache.uv;
const DEFAULT_PORT = 17654;
const DAEMON_PROTOCOL_VERSION = 2;
const MAX_MACHINE_OUTPUT_BYTES = 2 * 1024 * 1024;
const SUPPORTED_TASK_KINDS = [
  "ge.command",
  "process.command",
  "harness.run",
  "mission.run",
  "autopilot.run",
  "doctor",
  "mock.generate",
  "snowfakery.generate",
  "simulator.seed",
  "simulator.validate",
];

const json = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body, null, 2));
};

function ensureStore() {
  ensureStateLayout();
  mkdirSync(RUNS_DIR, { recursive: true });
}

// readJson/writeJson come from the shared atomic json-io helper (see import above).

function runDir(id) {
  return join(RUNS_DIR, id);
}

function runMetaPath(id) {
  return join(runDir(id), "run.json");
}

function runEventsPath(id) {
  return join(runDir(id), "events.jsonl");
}

function interactionDir(id) {
  return join(runDir(id), "interactions");
}

function newTaskId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function appendEvent(id, event) {
  const ev = { ts: new Date().toISOString(), ...event };
  appendFileSync(runEventsPath(id), JSON.stringify(ev) + "\n", "utf8");
  return ev;
}

function listEvents(id) {
  const path = runEventsPath(id);
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8").split("\n").filter(Boolean).map((line) => {
    try { return JSON.parse(line); } catch { return null; }
  }).filter(Boolean);
}

function listSequencedEvents(id) {
  return listEvents(id).map((event, index) => ({ seq: index + 1, event }));
}

function taskStatusState(status) {
  if (status === "done") return "done";
  if (status === "skipped") return "skipped";
  if (["blocked", "failed"].includes(status)) return "blocked";
  if (status === "paused") return "paused";
  if (["running", "queued"].includes(status)) return "running";
  return status || "blocked";
}

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
    "apps/ge-demo-generator/scripts/plan-mock-data.mjs",
    "apps/ge-demo-generator/scripts/materialize-simulator-seeds.mjs",
    "apps/ge-demo-generator/scripts/validate-simulator-pack.mjs",
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

function runtimeEnv(extra = {}) {
  mkdirSync(DEFAULT_UV_CACHE_DIR, { recursive: true });
  return {
    ...process.env,
    PATH: toolAugmentedPath(process.env),
    UV_CACHE_DIR: process.env.UV_CACHE_DIR || DEFAULT_UV_CACHE_DIR,
    CLOUDSDK_CORE_DISABLE_PROMPTS: "1",
    ...extra,
  };
}

function commandOutput(result = {}, { preserveMachineStdout = false } = {}) {
  const stdout = String(result.stdout || "");
  const stderr = String(result.stderr || "");
  return {
    stdout: stdout.slice(-4000),
    stderr: stderr.slice(-4000),
    ...(preserveMachineStdout ? { stdoutFull: stdout.slice(-MAX_MACHINE_OUTPUT_BYTES) } : {}),
  };
}

export function safeMissionRuntimeCommand(kind, input = {}) {
  return safeMissionNodeCommand(kind, input);
}

export function safeHarnessRunInput(input = {}) {
  const workspaceDir = resolve(REPO_ROOT, input.workspaceDir || input.workspace || ".");
  const agent = String(input.agent || input.provider || "antigravity-sdk");
  const stage = String(input.stage || "review");
  const allowedAgents = new Set(["antigravity-sdk", "agy", "gemini", "mock"]);
  const allowedStages = new Set(["review", "interview", "spec_generation", "mock_data", "data_plan", "simulation", "simulator", "eval", "validate"]);
  return workspaceDir.startsWith(REPO_ROOT)
    && allowedAgents.has(agent)
    && stage.split(",").every((item) => allowedStages.has(item.trim()))
    && String(input.message || "").trim().length > 0;
}

function commandList(id, safeToRun) {
  return [
    `ge runtime task ${id} --json`,
    ...(safeToRun ? [`ge runtime resume ${id}`] : []),
    `ge runtime events ${id} --follow`,
  ];
}

export function resumePlanFor(run) {
  if (!run) return null;
  const output = run.output || {};
  const items = output.items || [];
  const blockers = items.flatMap((item) => item.blockers || []).concat(output.blockers || []);
  const artifacts = output.artifactRefs || [];
  const state = taskStatusState(run.status);
  const base = {
    state,
    nextAction: "none",
    safeToRun: false,
    reason: "",
    commands: commandList(run.id, false),
    blockers,
    artifacts,
  };

  if (["done", "skipped"].includes(run.status)) {
    return { ...base, state: run.status, reason: `task is ${run.status}; no resume action is needed` };
  }
  if (["running", "queued"].includes(run.status)) {
    return { ...base, state: "running", nextAction: "wait", reason: "task is already running; watch events" };
  }

  if (run.kind === "autopilot.run") {
    if (["blocked", "paused", "failed"].includes(run.status) && output.run && items.length) {
      const blocked = items.find((item) => item.status === "blocked");
      const pending = items.find((item) => ["pending", "doctor_running", "repairing"].includes(item.status));
      const nextAction = pending ? "resume_autopilot" : blocked ? "resume_autopilot" : "resume_autopilot";
      return {
        ...base,
        state: run.status === "paused" ? "paused" : "blocked",
        nextAction,
        safeToRun: true,
        commands: commandList(run.id, true),
        reason: blocked
          ? `${blocked.agentId}: ${blocked.blockers?.[0]?.message || blocked.blockers?.[0]?.id || "blocked"}`
          : "start a child Autopilot run from original input",
      };
    }
    return { ...base, state: "blocked", nextAction: "inspect_blocker", reason: run.error || "Autopilot task has no resumable item state" };
  }

  if (run.kind === "doctor") {
    if (["blocked", "failed"].includes(run.status)) {
      return {
        ...base,
        state: "blocked",
        nextAction: "rerun_doctor",
        safeToRun: false,
        commands: commandList(run.id, false),
        reason: run.report?.fails ? `doctor has ${run.report.fails} failing check(s); run the suggested setup or doctor command explicitly` : "doctor is blocked; inspect checks before rerun",
        blockers: run.report?.sections?.flatMap((section) => (section.checks || []).filter((check) => check.status === "fail")) || blockers,
      };
    }
    return base;
  }

  if (run.kind === "ge.command") {
    if (run.status === "failed") {
      const safe = safeGeCommand(run.input?.argv || []);
      return {
        ...base,
        state: "blocked",
        nextAction: safe ? "rerun_task" : "inspect_blocker",
        safeToRun: safe,
        commands: commandList(run.id, safe),
        reason: safe ? "failed command is classified safe to rerun" : "failed command may mutate external state; inspect before rerun",
      };
    }
    return base;
  }

  if (run.kind === "process.command") {
    if (run.status === "failed") {
      const safe = safeProcessCommand(run.input?.argv || []);
      return {
        ...base,
        state: "blocked",
        nextAction: safe ? "rerun_task" : "inspect_blocker",
        safeToRun: safe,
        commands: commandList(run.id, safe),
        reason: safe ? "failed repo-local script is classified safe to rerun" : "failed process command is not classified safe to rerun",
      };
    }
    return base;
  }

  if (run.kind === "harness.run") {
    if (run.status === "failed") {
      const safe = safeHarnessRunInput(run.input || {});
      return {
        ...base,
        state: "blocked",
        nextAction: safe ? "rerun_harness" : "inspect_blocker",
        safeToRun: safe,
        commands: commandList(run.id, safe),
        reason: safe ? "harness run is classified safe to rerun" : "harness run input is not classified safe to rerun",
      };
    }
    return base;
  }

  if (isDataMissionNodeKind(run.kind)) {
    if (run.status === "failed") {
      const safe = safeMissionNodeCommand(run.kind, run.input || {});
      return {
        ...base,
        state: "blocked",
        nextAction: safe ? "rerun_task" : "inspect_blocker",
        safeToRun: safe,
        commands: commandList(run.id, safe),
        reason: safe ? `${run.kind} is classified safe to rerun` : `${run.kind} is not classified safe to rerun`,
      };
    }
    return base;
  }

  if (run.kind === "mission.run") {
    const graph = output.graph || {};
    const blockedNode = (graph.nodes || []).find((node) => ["blocked", "failed"].includes(node.status));
    if (["blocked", "paused", "failed"].includes(run.status)) {
      return {
        ...base,
        state: run.status === "paused" ? "paused" : "blocked",
        nextAction: "resume_mission",
        safeToRun: true,
        commands: [`ge mission resume ${run.id}`, `ge runtime events ${run.id} --follow`],
        reason: blockedNode ? `${blockedNode.id}: ${blockedNode.resumePlan?.reason || "blocked"}` : "resume mission graph by scheduling a child mission run",
        blockers: blockedNode?.resumePlan?.blockers || blockers,
        artifacts: graph.nodes?.flatMap((node) => node.artifacts || []) || artifacts,
      };
    }
    return base;
  }

  return { ...base, state: "blocked", nextAction: "inspect_blocker", reason: `no deterministic resume handler for task kind ${run.kind || "<unset>"}` };
}

function taskSummary(run) {
  if (!run) return null;
  const events = listEvents(run.id);
  const lastEvent = events.at(-1) || null;
  const output = run.output || {};
  const counts = output.counts || (output.run ? {
    total: output.run.total || 0,
    passed: output.run.passed || 0,
    repaired: output.run.repaired || 0,
    blocked: output.run.blocked || 0,
  } : output.graph?.counts || null);
  const blockedItem = (output.items || []).find((item) => item.status === "blocked");
  const runningItem = (output.items || []).find((item) => ["pending", "doctor_running", "repairing"].includes(item.status));
  const resumePlan = resumePlanFor(run);
  return {
    id: run.id,
    kind: run.kind,
    status: run.status,
    createdAt: run.createdAt,
    updatedAt: run.updatedAt,
    endedAt: run.endedAt || null,
    input: run.input,
    counts,
    lastEvent,
    resumePlan,
    nextAction: resumePlan?.nextAction || blockedItem?.nextAction || runningItem?.nextAction || (["running", "queued"].includes(run.status) ? "wait" : "none"),
    artifactRefs: output.artifactRefs || output.graph?.nodes?.flatMap((node) => node.artifacts || []) || [],
    summary: output.reason || lastEvent?.line || run.error || "",
  };
}

function taskDetail(run) {
  if (!run) return null;
  return { ...run, summary: taskSummary(run) };
}

function normalizedTaskSummary(run) {
  const summary = taskSummary(run);
  return summary ? normalizeRuntimeTask(summary) : null;
}

function normalizedTaskDetail(run) {
  const detail = taskDetail(run);
  return detail ? normalizeRuntimeTask(detail) : null;
}

function updateRun(id, patch) {
  const current = readJson(runMetaPath(id), {});
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  writeJson(runMetaPath(id), next);
  return next;
}

function listRuns(limit = 50) {
  return existsSync(RUNS_DIR)
    ? readdirSafe(RUNS_DIR)
      .map((id) => readJson(runMetaPath(id), null))
      .filter(Boolean)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .slice(0, Math.max(1, Math.min(Number(limit) || 50, 200)))
    : [];
}

function listRunSummaries(limit = 50) {
  return listRuns(limit).map(normalizedTaskSummary).filter(Boolean);
}

function createRun({ id = newTaskId("task"), kind, input = {}, status = "running" }) {
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

function runOutput(id) {
  return readJson(runMetaPath(id), {}).output || {};
}

function updateRunOutput(id, patch) {
  const current = readJson(runMetaPath(id), {});
  return updateRun(id, { output: { ...(current.output || {}), ...patch } });
}

function appendResumeAttempt(id, patch) {
  const output = runOutput(id);
  const attempts = Array.isArray(output.resumeAttempts) ? output.resumeAttempts : [];
  updateRunOutput(id, { resumeAttempts: [...attempts, { ts: new Date().toISOString(), ...patch }] });
}

function terminalStatusForCode(code) {
  return code === 0 ? "done" : "failed";
}

function doctorArgv({ scope = "all", command } = {}) {
  const argv = ["doctor", "--json"];
  if (scope === "local") argv.push("--local");
  else if (scope === "cloud") argv.push("--cloud");
  else if (scope === "data") argv.push("--data");
  else if (scope === "mcp") argv.push("--mcp");
  if (command) argv.push("--command", command);
  return argv;
}

function replayDoctorReport(id, report) {
  for (const section of report.sections || []) {
    appendEvent(id, { type: "section_started", section: section.name, line: `checking ${section.name}` });
    for (const check of section.checks || []) {
      appendEvent(id, {
        type: "check_result",
        section: section.name,
        level: check.status === "fail" ? "error" : check.status === "warn" ? "warn" : "info",
        line: `${check.name}: ${check.status}`,
        check,
      });
    }
    appendEvent(id, {
      type: section.fails ? "section_blocked" : "section_done",
      section: section.name,
      level: section.fails ? "error" : "info",
      line: section.fails ? `${section.name}: ${section.fails} failure${section.fails === 1 ? "" : "s"}` : `${section.name}: passed`,
      sectionReport: section,
    });
  }
}

function startDoctorTask({ scope = "all", command } = {}) {
  const run = createRun({
    id: newTaskId("doctor"),
    kind: "doctor",
    input: { scope, command: command || null },
  });
  const { id } = run;
  appendEvent(id, { type: "doctor_started", line: command ? `doctor ${scope} readiness for ${command}` : `doctor ${scope}`, data: { scope, command: command || null } });

  const child = spawn(process.execPath, [GE_CLI, ...doctorArgv({ scope, command })], {
    cwd: REPO_ROOT,
    env: { ...process.env, CLOUDSDK_CORE_DISABLE_PROMPTS: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk) => { stdout += String(chunk); });
  child.stderr.on("data", (chunk) => {
    const text = String(chunk);
    stderr += text;
    for (const line of text.split(/\r?\n/).filter(Boolean)) {
      appendEvent(id, { type: "doctor_log", level: /fail|error|blocked/i.test(line) ? "error" : /warn|unset|not found/i.test(line) ? "warn" : "info", line });
    }
  });
  child.on("error", (error) => {
    const report = {
      mode: "all",
      project: null,
      region: null,
      sections: [{ name: "doctor", checks: [{ name: "doctor subprocess", status: "fail", detail: error.message || String(error), fix: "ge doctor --json" }], fails: 1 }],
      fails: 1,
    };
    replayDoctorReport(id, report);
    appendEvent(id, { type: "doctor_blocked", level: "error", line: "doctor subprocess failed", report });
    updateRun(id, { status: "failed", code: 1, endedAt: new Date().toISOString(), report });
  });
  child.on("close", (code) => {
    let report;
    try {
      report = JSON.parse(stdout || "{}");
    } catch {
      report = {
        mode: "all",
        project: null,
        region: null,
        sections: [{ name: "doctor", checks: [{ name: "doctor output", status: "fail", detail: (stderr || stdout || "no output").slice(-1000), fix: "ge doctor --json" }], fails: 1 }],
        fails: 1,
      };
    }
    if (code !== 0 && (!report.sections || !report.sections.length)) {
      report.sections = [{ name: "doctor", checks: [{ name: "doctor exit", status: "fail", detail: `exit ${code}`, fix: "ge doctor --json" }], fails: 1 }];
      report.fails = 1;
    }
    replayDoctorReport(id, report);
    appendEvent(id, {
      type: report.fails ? "doctor_blocked" : "doctor_done",
      level: report.fails ? "error" : "info",
      line: report.fails ? `blocked by ${report.fails} failure${report.fails === 1 ? "" : "s"}` : "all checks passed",
      report,
    });
    updateRun(id, { status: report.fails ? "blocked" : "done", code, endedAt: new Date().toISOString(), report });
  });
  return run;
}

function startGeCommandTask({ argv = [], command = null } = {}) {
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

function startProcessCommandTask({ argv = [], command = null } = {}) {
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

function harnessRunArgv(input = {}) {
  const workspaceDir = resolve(REPO_ROOT, input.workspaceDir || input.workspace || ".");
  const agent = String(input.agent || input.provider || "antigravity-sdk");
  const stage = String(input.stage || "review");
  const args = [
    HARNESS_CLI,
    "agent",
    "run",
    "--workspace-dir",
    workspaceDir,
    "--message",
    String(input.message || ""),
    "--agent",
    agent,
    "--stage",
    stage,
    "--permission-profile",
    input.permissionProfile || "review",
    "--stream-events",
    "true",
  ];
  if (input.vertex !== false) args.push("--vertex", "true");
  else args.push("--no-vertex", "true");
  if (input.project) args.push("--project", String(input.project));
  if (input.location) args.push("--location", String(input.location));
  if (input.model) args.push("--model", String(input.model));
  if (input.timeoutSec) args.push("--timeout-sec", String(input.timeoutSec));
  return args;
}

function normalizeInteractionResponses(body = {}) {
  const responses = Array.isArray(body.responses) ? body.responses : [];
  return {
    schemaVersion: 1,
    interactionId: body.interactionId || body.id || null,
    cancelled: body.cancelled === true,
    responses: responses.map((response) => ({
      questionId: String(response.questionId || response.id || ""),
      selectedOptionIds: Array.isArray(response.selectedOptionIds)
        ? response.selectedOptionIds.map(String)
        : Array.isArray(response.selected_option_ids)
          ? response.selected_option_ids.map(String)
          : [],
      freeformResponse: response.freeformResponse != null ? String(response.freeformResponse) : response.freeform_response != null ? String(response.freeform_response) : "",
      skipped: response.skipped === true,
    })),
    submittedAt: new Date().toISOString(),
  };
}

function submitInteractionResponse(taskId, interactionId, body = {}) {
  const run = readJson(runMetaPath(taskId), null);
  if (!run) return { status: 404, body: { error: "unknown task" } };
  if (run.kind !== "harness.run") return { status: 400, body: { error: "task does not accept interactions" } };
  if (!/^[a-zA-Z0-9._:-]+$/.test(interactionId)) return { status: 400, body: { error: "invalid interaction id" } };
  const dir = interactionDir(taskId);
  const requestPath = join(dir, "requests", `${interactionId}.json`);
  if (!existsSync(requestPath)) return { status: 404, body: { error: "unknown interaction" } };
  const response = normalizeInteractionResponses({ ...body, interactionId });
  mkdirSync(join(dir, "responses"), { recursive: true });
  writeJson(join(dir, "responses", `${interactionId}.json`), response);
  appendEvent(taskId, {
    type: "ge.interaction.response",
    stage: "harness.run",
    line: `submitted interaction response ${interactionId}`,
    interactionId,
    data: { responseCount: response.responses.length, cancelled: response.cancelled, responses: response.responses },
  });
  return { status: 202, body: { ok: true, interactionId, responseCount: response.responses.length } };
}

function resolveHarnessRunInput(input = {}) {
  const cfg = core.loadConfig(input.query || {});
  const useVertex = input.vertex !== false;
  return {
    ...input,
    vertex: useVertex,
    project: input.project
      || input.vertexProject
      || cfg.project
      || process.env.GOOGLE_CLOUD_PROJECT
      || process.env.GCLOUD_PROJECT
      || process.env.GCP_PROJECT_ID
      || null,
    location: input.location
      || input.vertexLocation
      || cfg.geLocation
      || process.env.GOOGLE_CLOUD_LOCATION
      || process.env.GOOGLE_GENAI_LOCATION
      || process.env.GEMINI_ENTERPRISE_LOCATION
      || "global",
  };
}

function expectedHarnessArtifacts(input = {}) {
  const artifacts = Array.isArray(input.expectedArtifacts) ? input.expectedArtifacts : [];
  return artifacts
    .filter((artifact) => artifact && typeof artifact === "object")
    .map((artifact) => ({
      ...artifact,
      path: artifact.path ? String(artifact.path) : undefined,
      type: artifact.type ? String(artifact.type) : "file",
      name: artifact.name ? String(artifact.name) : artifact.path ? String(artifact.path) : "artifact",
    }))
    .filter((artifact) => {
      if (!artifact.path || artifact.path.includes("\0")) return false;
      const resolved = resolve(REPO_ROOT, artifact.path);
      return resolved === REPO_ROOT || resolved.startsWith(`${REPO_ROOT}/`);
    });
}

function inspectHarnessArtifacts(run, result = null) {
  const expected = expectedHarnessArtifacts(run.input || {});
  if (!expected.length) return { artifactRefs: [], artifactCheck: null };
  const artifactCheck = verifyMissionArtifacts(expected, {
    repoRoot: REPO_ROOT,
    childTask: result ? { output: result } : null,
  });
  appendEvent(run.id, {
    type: artifactCheck.ok ? "artifacts_ready" : "artifacts_blocked",
    stage: "harness.run",
    level: artifactCheck.ok ? "info" : "warn",
    line: artifactCheck.ok
      ? `${artifactCheck.counts.present}/${artifactCheck.counts.total} expected artifact(s) ready`
      : `${artifactCheck.counts.present}/${artifactCheck.counts.total} expected artifact(s) ready, ${artifactCheck.blockers.length} issue(s)`,
    artifactCheck,
  });
  return { artifactRefs: artifactCheck.artifacts, artifactCheck };
}

function startHarnessRunTask(input = {}) {
  const resolvedInput = resolveHarnessRunInput(input);
  if (!safeHarnessRunInput(resolvedInput)) throw new Error("harness run input is not classified safe to run");
  if (resolvedInput.vertex !== false && (!resolvedInput.project || !resolvedInput.location) && !process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    throw new Error("Antigravity Vertex execution requires project and location. Run `ge init`, set GOOGLE_CLOUD_PROJECT, or provide an API key for Express Mode.");
  }
  const args = harnessRunArgv(resolvedInput);
  const run = createRun({
    id: newTaskId("harness"),
    kind: "harness.run",
    input: resolvedInput,
  });
  mkdirSync(interactionDir(run.id), { recursive: true });
  appendEvent(run.id, { type: "stage_started", stage: "harness.run", line: `$ node apps/ge-demo-generator/src/cli.js agent run --workspace-dir ${resolvedInput.workspaceDir || resolvedInput.workspace || "."} --agent ${resolvedInput.agent || resolvedInput.provider || "antigravity-sdk"} --stage ${resolvedInput.stage || "review"}` });

  execStream(process.execPath, args, {
    cwd: REPO_ROOT,
    env: { ...process.env, CLOUDSDK_CORE_DISABLE_PROMPTS: "1", GE_HARNESS_INTERACTION_DIR: interactionDir(run.id) },
    meta: { runId: run.id, stage: "harness.run" },
    onEvent: (event) => appendEvent(run.id, event),
  }).then((result) => {
    const status = terminalStatusForCode(result.code);
    appendEvent(run.id, {
      type: status === "done" ? "stage_done" : "stage_failed",
      stage: "harness.run",
      level: status === "done" ? "info" : "error",
      line: `exit ${result.code}`,
      data: { code: result.code, signal: result.signal || null },
    });
    updateRun(run.id, {
      status,
      code: result.code,
      endedAt: new Date().toISOString(),
      output: {
        stdout: result.stdout.slice(-8000),
        stderr: result.stderr.slice(-8000),
        ...inspectHarnessArtifacts(run, result),
      },
    });
  }).catch((error) => {
    const line = error?.message || String(error);
    appendEvent(run.id, { type: "stage_failed", stage: "harness.run", level: "error", line });
    updateRun(run.id, {
      status: "failed",
      code: 1,
      endedAt: new Date().toISOString(),
      error: line,
      output: inspectHarnessArtifacts(run),
    });
  });

  return run;
}

function startMissionNodeCommandTask(kind, input = {}) {
  const command = missionNodeCommand(kind, input);
  const run = createRun({
    id: newTaskId(command.prefix),
    kind,
    input,
  });
  appendEvent(run.id, { type: "stage_started", stage: command.stage, line: `$ ${command.argv.join(" ")}` });

  execStream(command.cmd, command.args, {
    cwd: REPO_ROOT,
    env: runtimeEnv(),
    meta: { runId: run.id, stage: command.stage },
    onEvent: (event) => appendEvent(run.id, event),
  }).then((result) => {
    const status = terminalStatusForCode(result.code);
    appendEvent(run.id, {
      type: status === "done" ? "stage_done" : "stage_failed",
      stage: command.stage,
      level: status === "done" ? "info" : "error",
      line: `exit ${result.code}`,
      data: { code: result.code, signal: result.signal || null },
    });
    updateRun(run.id, { status, code: result.code, endedAt: new Date().toISOString(), output: commandOutput(result, { preserveMachineStdout: true }) });
  }).catch((error) => {
    const line = error?.message || String(error);
    appendEvent(run.id, { type: "stage_failed", stage: command.stage, level: "error", line });
    updateRun(run.id, { status: "failed", code: 1, endedAt: new Date().toISOString(), error: line });
  });

  return run;
}

function taskTerminal(run) {
  return run && !["running", "queued"].includes(run.status);
}

function waitForTaskTerminal(id, { intervalMs = 300, onEvent = null } = {}) {
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

function childStatusToNodeStatus(status) {
  if (status === "done") return "done";
  if (status === "skipped") return "skipped";
  if (["blocked", "failed"].includes(status)) return "blocked";
  return status || "blocked";
}

function rehomeResumePlan(plan = null, fromMissionId = null, toMissionId = null) {
  if (!plan || !toMissionId) return plan;
  const from = fromMissionId ? String(fromMissionId) : "";
  return {
    ...plan,
    commands: Array.isArray(plan.commands)
      ? plan.commands.map((command) => from ? String(command).replaceAll(from, toMissionId) : String(command))
      : [],
  };
}

function rehomeMissionGraph(graph = null, missionId = null, fromMissionId = null) {
  if (!graph || !missionId) return graph;
  return {
    ...graph,
    id: missionId,
    nodes: (graph.nodes || []).map((node) => ({
      ...node,
      missionId,
      resumePlan: rehomeResumePlan(node.resumePlan, fromMissionId || graph.id, missionId),
      childTask: node.childTask?.resumePlan
        ? { ...node.childTask, resumePlan: rehomeResumePlan(node.childTask.resumePlan, fromMissionId || graph.id, missionId) }
        : node.childTask || null,
    })),
    edges: graph.edges || [],
  };
}

function attachMissionResumeChild({ parentId, child, nodeId = null }) {
  const parent = readJson(runMetaPath(parentId), null);
  if (!parent || !child) return;
  const currentOutput = parent.output || {};
  const parentGraph = currentOutput.graph || null;
  const delegatedGraph = parentGraph && nodeId
    ? patchMissionNode(parentGraph, nodeId, {
      status: "running",
      childTaskId: child.id,
      childTask: taskSummary(child),
      blockers: [],
    })
    : parentGraph;
  updateRun(parentId, {
    status: "running",
    endedAt: null,
    output: {
      ...currentOutput,
      graph: delegatedGraph || parentGraph,
      counts: delegatedGraph?.counts || currentOutput.counts || parentGraph?.counts || null,
      delegatedTaskId: child.id,
      delegatedNodeId: nodeId,
    },
  });

  waitForTaskTerminal(child.id, {
    onEvent: (wrapped) => {
      const event = wrapped.event || {};
      if (!event.line) return;
      appendEvent(parentId, {
        type: "mission_resume_child_event",
        level: event.level || "info",
        childTaskId: child.id,
        childSeq: wrapped.seq,
        childEventType: event.type || null,
        line: `${child.id}: ${event.line}`,
      });
    },
  }).then((finishedChild) => {
    const latestParent = readJson(runMetaPath(parentId), parent);
    const childOutput = finishedChild?.output || {};
    const childGraph = childOutput.graph
      ? rehomeMissionGraph(childOutput.graph, parentId, child.id)
      : latestParent.output?.graph || null;
    const nextOutput = {
      ...(latestParent.output || {}),
      ...childOutput,
      graph: childGraph,
      counts: childGraph?.counts || childOutput.counts || latestParent.output?.counts || null,
      artifactRefs: childGraph?.nodes?.flatMap((node) => node.artifacts || []) || childOutput.artifactRefs || latestParent.output?.artifactRefs || [],
      delegatedTaskId: child.id,
      delegatedNodeId: nodeId,
    };
    appendEvent(parentId, {
      type: "mission_resume_child_terminal",
      level: finishedChild.status === "done" ? "info" : "warn",
      childTaskId: child.id,
      line: `child mission ${child.id} ${finishedChild.status}`,
      counts: nextOutput.counts || null,
    });
    updateRun(parentId, {
      status: finishedChild.status,
      endedAt: finishedChild.endedAt || new Date().toISOString(),
      error: finishedChild.error || null,
      output: nextOutput,
    });
  }).catch((error) => {
    const line = error?.message || String(error);
    appendEvent(parentId, { type: "mission_resume_child_failed", level: "error", childTaskId: child.id, line });
    updateRun(parentId, { status: "failed", endedAt: new Date().toISOString(), error: line });
  });
}

async function startChildForMissionNode(node) {
  if (node.runtimeKind === "doctor") return startDoctorTask(node.input || {});
  if (node.runtimeKind === "ge.command") return startGeCommandTask(node.input || {});
  if (node.runtimeKind === "process.command") return startProcessCommandTask(node.input || {});
  if (node.runtimeKind === "harness.run") return startHarnessRunTask(node.input || {});
  if (isDataMissionNodeKind(node.runtimeKind)) return startMissionNodeCommandTask(node.runtimeKind, node.input || {});
  if (node.runtimeKind === "autopilot.run") return await startAutopilotTask(node.input || {});
  throw new Error(`unsupported mission node runtime kind: ${node.runtimeKind || "<unset>"}`);
}

function affectedMissionNodeIds(graph = {}, startNodeId = null) {
  if (!startNodeId) return new Set();
  const nodes = graph.nodes || [];
  const childrenById = new Map();
  for (const node of nodes) {
    for (const dep of node.dependsOn || []) {
      childrenById.set(dep, [...(childrenById.get(dep) || []), node.id]);
    }
  }
  const affected = new Set([startNodeId]);
  const queue = [startNodeId];
  while (queue.length) {
    const current = queue.shift();
    for (const child of childrenById.get(current) || []) {
      if (affected.has(child)) continue;
      affected.add(child);
      queue.push(child);
    }
  }
  return affected;
}

function rehydrateMissionGraphForResume(resumeGraph = {}, plannedGraph = {}, startNodeId = null) {
  if (!resumeGraph || !plannedGraph) return resumeGraph;
  const plannedById = new Map((plannedGraph.nodes || []).map((node) => [node.id, node]));
  const affected = affectedMissionNodeIds(resumeGraph, startNodeId);
  const nodes = (resumeGraph.nodes || []).map((node) => {
    const planned = plannedById.get(node.id);
    if (!planned) return node;
    const shouldRunAgain = affected.has(node.id);
    const currentArtifacts = Array.isArray(node.artifacts) ? node.artifacts : [];
    const plannedArtifacts = Array.isArray(planned.artifacts) ? planned.artifacts : [];
    const next = {
      ...node,
      kind: planned.kind,
      label: planned.label,
      runtimeKind: planned.runtimeKind,
      input: planned.input,
      dependsOn: planned.dependsOn,
      blockers: Array.isArray(node.blockers) ? node.blockers : [],
      artifacts: shouldRunAgain ? plannedArtifacts : currentArtifacts.length ? currentArtifacts : plannedArtifacts,
    };
    return { ...next, resumePlan: node.resumePlan };
  });
  return {
    ...resumeGraph,
    input: { ...(plannedGraph.input || {}), ...(resumeGraph.input || {}) },
    edges: plannedGraph.edges || resumeGraph.edges || [],
    nodes,
  };
}

async function startMissionTask({ ids = [], scenario = null, spec = null, workspace = null, systems = [], targetStage = "preview", repair = true, attempts = 3, runPreview = false, query = {}, mode = null, executeFactory = false, useAntigravity = true, harnessAgent = "antigravity-sdk", harnessModel = "gemini-3.5-flash", harnessLocation = "global", resumedFrom = null, resumeGraph = null, startAtNode = null } = {}) {
  const cfg = core.loadConfig(query || {});
  const plannedGraph = buildMissionGraph({
    mode: mode || cfg.mode || "local",
    ids,
    scenario,
    spec,
    workspace,
    systems,
    targetStage,
    repair,
    attempts,
    runPreview,
    query,
    executeFactory,
    useAntigravity,
    harnessAgent,
    harnessModel,
    harnessLocation,
  });
  const rehydratedGraph = resumeGraph && startAtNode ? rehydrateMissionGraphForResume(resumeGraph, plannedGraph, startAtNode) : null;
  const graph = rehydratedGraph && startAtNode ? resetMissionGraphForResume({ ...rehydratedGraph, id: plannedGraph.id }, startAtNode) : plannedGraph;
  const run = createRun({
    id: graph.id,
    kind: "mission.run",
    input: { ids, scenario, spec, workspace, systems, targetStage, repair, attempts, runPreview, query, mode: mode || cfg.mode || "local", executeFactory, useAntigravity, harnessAgent, harnessModel, harnessLocation, resumedFrom, startAtNode },
  });
  updateRunOutput(run.id, { graph, counts: graph.counts, artifactRefs: [] });
  appendEvent(run.id, { type: "mission_started", line: `mission ${run.id} started`, graph: { id: graph.id, counts: graph.counts } });
  if (rehydratedGraph) {
    appendEvent(run.id, {
      type: "mission_graph_rehydrated",
      level: "info",
      line: `mission graph rehydrated from current node registry at ${startAtNode}`,
      startAtNode,
    });
  }

  (async () => {
    let current = graph;
    try {
      for (;;) {
        const node = nextRunnableMissionNode(current);
        if (!node) break;
        current = patchMissionNode(current, node.id, { status: "running" });
        updateRunOutput(run.id, { graph: current, counts: current.counts });
        appendEvent(run.id, { type: "mission_node_started", nodeId: node.id, line: `${node.id}: scheduling ${node.runtimeKind}` });
        const child = await startChildForMissionNode(node);
        current = patchMissionNode(current, node.id, { childTaskId: child.id, status: "running", childTask: taskSummary(child) });
        updateRunOutput(run.id, { graph: current, counts: current.counts });
        appendEvent(run.id, { type: "mission_child_started", nodeId: node.id, childTaskId: child.id, line: `${node.id}: child task ${child.id}` });
        const finishedChild = await waitForTaskTerminal(child.id, {
          onEvent: (wrapped) => {
            const event = wrapped.event || {};
            if (!event.line) return;
            appendEvent(run.id, {
              type: "mission_child_log",
              level: event.level || "info",
              nodeId: node.id,
              childTaskId: child.id,
              childSeq: wrapped.seq,
              line: `${node.id}: ${event.line}`,
              childEventType: event.type || null,
            });
          },
        });
        const childDetail = taskDetail(finishedChild);
        const plan = childDetail?.summary?.resumePlan || null;
        const baseArtifactCheck = verifyMissionArtifacts(node.artifacts || [], { repoRoot: REPO_ROOT, childTask: finishedChild });
        const nodeSummary = summarizeMissionNode({ node, childTask: finishedChild, artifactCheck: baseArtifactCheck });
        const semanticCheck = validateMissionNodeArtifacts(node.kind || node.runtimeKind, { input: node.input || {}, artifactCheck: baseArtifactCheck, summary: nodeSummary });
        const artifactCheck = {
          ...baseArtifactCheck,
          ok: baseArtifactCheck.ok && semanticCheck.ok,
          blockers: [...(baseArtifactCheck.blockers || []), ...(semanticCheck.blockers || [])],
          warnings: semanticCheck.warnings || [],
          semantic: semanticCheck,
        };
        const childNodeStatus = childStatusToNodeStatus(finishedChild?.status);
        const nodeStatus = childNodeStatus === "done" && !artifactCheck.ok ? "blocked" : childNodeStatus;
        const blockers = [
          ...(plan?.blockers || []),
          ...(childNodeStatus === "done" ? artifactCheck.blockers : []),
        ];
        current = patchMissionNode(current, node.id, {
          status: nodeStatus,
          childTaskId: child.id,
          childTask: childDetail?.summary || null,
          blockers,
          warnings: artifactCheck.warnings || [],
          artifacts: artifactCheck.artifacts.length ? artifactCheck.artifacts : plan?.artifacts || childDetail?.summary?.artifactRefs || [],
          artifactCheck,
          summary: nodeSummary,
        });
        updateRunOutput(run.id, {
          graph: current,
          counts: current.counts,
          artifactRefs: current.nodes.flatMap((graphNode) => graphNode.artifacts || []),
        });
        appendEvent(run.id, {
          type: nodeStatus === "blocked" ? "mission_node_blocked" : "mission_node_done",
          level: nodeStatus === "blocked" ? "error" : "info",
          nodeId: node.id,
          childTaskId: child.id,
          line: artifactCheck.ok ? `${node.id}: ${nodeStatus}` : `${node.id}: blocked by ${artifactCheck.blockers.length} artifact issue${artifactCheck.blockers.length === 1 ? "" : "s"}`,
          resumePlan: plan,
          artifactCheck,
          summary: nodeSummary,
        });
        if (nodeStatus === "blocked") break;
      }
      const finalStatus = current.status === "blocked" ? "blocked" : current.counts.pending || current.counts.running ? "paused" : "done";
      appendEvent(run.id, {
        type: finalStatus === "done" ? "mission_done" : "mission_blocked",
        level: finalStatus === "done" ? "info" : "warn",
        line: `mission ${finalStatus}`,
        counts: current.counts,
      });
      updateRun(run.id, { status: finalStatus, endedAt: new Date().toISOString(), output: { ...runOutput(run.id), graph: { ...current, status: finalStatus }, counts: current.counts } });
    } catch (error) {
      const line = error?.message || String(error);
      appendEvent(run.id, { type: "mission_failed", level: "error", line });
      updateRun(run.id, { status: "failed", endedAt: new Date().toISOString(), error: line, output: runOutput(run.id) });
    }
  })();

  return readJson(runMetaPath(run.id), run);
}

function resumeGeCommandTask(run) {
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

function resumeProcessCommandTask(run) {
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

function resumeHarnessRunTask(run) {
  if (!safeHarnessRunInput(run.input || {})) throw new Error("stored harness run input is not classified safe to run");
  const args = harnessRunArgv(run.input || {});
  mkdirSync(interactionDir(run.id), { recursive: true });
  updateRun(run.id, { status: "running", endedAt: null, error: null });
  appendEvent(run.id, { type: "stage_started", stage: "harness.run", line: `$ node apps/ge-demo-generator/src/cli.js agent run --agent ${run.input?.agent || run.input?.provider || "antigravity-sdk"} --stage ${run.input?.stage || "review"} (resume)` });
  execStream(process.execPath, args, {
    cwd: REPO_ROOT,
    env: { ...process.env, CLOUDSDK_CORE_DISABLE_PROMPTS: "1", GE_HARNESS_INTERACTION_DIR: interactionDir(run.id) },
    meta: { runId: run.id, stage: "harness.run" },
    onEvent: (event) => appendEvent(run.id, event),
  }).then((result) => {
    const status = terminalStatusForCode(result.code);
    appendEvent(run.id, {
      type: status === "done" ? "resume_done" : "resume_failed",
      stage: "harness.run",
      level: status === "done" ? "info" : "error",
      line: `exit ${result.code}`,
      data: { code: result.code, signal: result.signal || null },
    });
    appendResumeAttempt(run.id, { status, action: "rerun_harness", code: result.code });
    updateRun(run.id, {
      status,
      code: result.code,
      endedAt: new Date().toISOString(),
      output: {
        ...runOutput(run.id),
        stdout: result.stdout.slice(-8000),
        stderr: result.stderr.slice(-8000),
        ...inspectHarnessArtifacts(run, result),
      },
    });
  }).catch((error) => {
    const line = error?.message || String(error);
    appendEvent(run.id, { type: "resume_failed", stage: "harness.run", level: "error", line });
    appendResumeAttempt(run.id, { status: "failed", action: "rerun_harness", error: line });
    updateRun(run.id, {
      status: "failed",
      code: 1,
      endedAt: new Date().toISOString(),
      error: line,
      output: { ...runOutput(run.id), ...inspectHarnessArtifacts(run) },
    });
  });
}

function resumeMissionNodeCommandTask(run) {
  const command = missionNodeCommand(run.kind, run.input || {});
  updateRun(run.id, { status: "running", endedAt: null, error: null });
  appendEvent(run.id, { type: "stage_started", stage: command.stage, line: `$ ${command.argv.join(" ")} (resume)` });
  execStream(command.cmd, command.args, {
    cwd: REPO_ROOT,
    env: runtimeEnv(),
    meta: { runId: run.id, stage: command.stage },
    onEvent: (event) => appendEvent(run.id, event),
  }).then((result) => {
    const status = terminalStatusForCode(result.code);
    appendEvent(run.id, {
      type: status === "done" ? "resume_done" : "resume_failed",
      stage: command.stage,
      level: status === "done" ? "info" : "error",
      line: `exit ${result.code}`,
      data: { code: result.code, signal: result.signal || null },
    });
    appendResumeAttempt(run.id, { status, action: `rerun_${run.kind}`, code: result.code });
    updateRun(run.id, { status, code: result.code, endedAt: new Date().toISOString(), output: { ...runOutput(run.id), ...commandOutput(result, { preserveMachineStdout: true }) } });
  }).catch((error) => {
    const line = error?.message || String(error);
    appendEvent(run.id, { type: "resume_failed", stage: command.stage, level: "error", line });
    appendResumeAttempt(run.id, { status: "failed", action: `rerun_${run.kind}`, error: line });
    updateRun(run.id, { status: "failed", code: 1, endedAt: new Date().toISOString(), error: line });
  });
}

function resumeDoctorTask(run) {
  const scope = run.input?.scope || "all";
  const command = run.input?.command || "";
  updateRun(run.id, { status: "running", endedAt: null, error: null });
  appendEvent(run.id, { type: "doctor_started", line: command ? `doctor ${scope} readiness for ${command} (resume)` : `doctor ${scope} (resume)`, data: { scope, command: command || null } });
  const child = spawn(process.execPath, [GE_CLI, ...doctorArgv({ scope, command })], {
    cwd: REPO_ROOT,
    env: { ...process.env, CLOUDSDK_CORE_DISABLE_PROMPTS: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk) => { stdout += String(chunk); });
  child.stderr.on("data", (chunk) => {
    const text = String(chunk);
    stderr += text;
    for (const line of text.split(/\r?\n/).filter(Boolean)) {
      appendEvent(run.id, { type: "doctor_log", level: /fail|error|blocked/i.test(line) ? "error" : /warn|unset|not found/i.test(line) ? "warn" : "info", line });
    }
  });
  child.on("error", (error) => {
    const report = {
      mode: "all",
      project: null,
      region: null,
      sections: [{ name: "doctor", checks: [{ name: "doctor subprocess", status: "fail", detail: error.message || String(error), fix: "ge doctor --json" }], fails: 1 }],
      fails: 1,
    };
    replayDoctorReport(run.id, report);
    appendEvent(run.id, { type: "resume_failed", level: "error", line: "doctor subprocess failed", report });
    appendResumeAttempt(run.id, { status: "failed", action: "rerun_doctor", error: error.message || String(error) });
    updateRun(run.id, { status: "failed", code: 1, endedAt: new Date().toISOString(), report });
  });
  child.on("close", (code) => {
    let report;
    try {
      report = JSON.parse(stdout || "{}");
    } catch {
      report = {
        mode: "all",
        project: null,
        region: null,
        sections: [{ name: "doctor", checks: [{ name: "doctor output", status: "fail", detail: (stderr || stdout || "no output").slice(-1000), fix: "ge doctor --json" }], fails: 1 }],
        fails: 1,
      };
    }
    replayDoctorReport(run.id, report);
    const status = report.fails ? "blocked" : "done";
    appendEvent(run.id, {
      type: report.fails ? "resume_blocked" : "resume_done",
      level: report.fails ? "error" : "info",
      line: report.fails ? `blocked by ${report.fails} failure${report.fails === 1 ? "" : "s"}` : "all checks passed",
      report,
    });
    appendResumeAttempt(run.id, { status, action: "rerun_doctor", code, fails: report.fails || 0 });
    updateRun(run.id, { status, code, endedAt: new Date().toISOString(), report });
  });
}

async function startAutopilotTask({ ids = [], targetStage = "preview", repair = true, attempts = 3, runPreview = false, query = {}, resumedFrom = null } = {}) {
  const cfg = core.loadConfig(query || {});
  const mission = await core.missionPlan(cfg, { ids, targetStage, repair, attempts, runPreview });
  const selectedItems = autopilotItemsFromMission(mission);
  const id = selectedItems.length ? newTaskId("auto") : newTaskId("auto-skip");
  const itemStates = selectedItems.map((item) => createAutopilotItemState({ runId: id, targetStage, ...item }));
  const runState = createAutopilotRunState({
    id,
    targetStage,
    options: { repair, attempts, runPreview, mode: cfg.mode, mission, daemonTask: true },
    items: itemStates,
    status: selectedItems.length ? "running" : "skipped",
  });
  const run = createRun({
    id,
    kind: "autopilot.run",
    input: { ids, targetStage, repair, attempts, runPreview, query, resumedFrom },
    status: runState.status,
  });
  updateRunOutput(id, { run: runState, items: itemStates, mission, counts: autopilotCounts(itemStates) });

  if (!selectedItems.length) {
    const reason = autopilotSkipReason(mission);
    appendEvent(id, { type: "stage_skipped", level: "info", line: reason, data: { summary: mission.summary, modeContract: mission.modeContract } });
    updateRun(id, { status: "skipped", endedAt: new Date().toISOString(), output: { ...runOutput(id), reason } });
    return readJson(runMetaPath(id), run);
  }

  runAutopilotConvergence({
    run: runState,
    items: itemStates,
    cfg,
    core,
    repair,
    attempts,
    runPreview,
    emit: (event) => appendEvent(id, event),
    updateItem: async (item) => {
      const output = runOutput(id);
      const items = (output.items || []).map((current) => current.agentId === item.agentId ? item : current);
      updateRunOutput(id, { items, counts: autopilotCounts(items) });
    },
  }).then((result) => {
    const output = runOutput(id);
    const finishedRun = {
      ...(output.run || runState),
      status: result.status,
      ...result.counts,
      updatedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
    };
    updateRun(id, {
      status: result.status,
      endedAt: new Date().toISOString(),
      output: { ...output, run: finishedRun, items: result.items, counts: result.counts },
    });
  }).catch((error) => {
    const output = runOutput(id);
    appendEvent(id, { type: "stage_failed", level: "error", line: error?.message || String(error) });
    updateRun(id, {
      status: "failed",
      endedAt: new Date().toISOString(),
      error: error?.message || String(error),
      output,
    });
  });

  return readJson(runMetaPath(id), run);
}

async function resumeTask(id) {
  const run = readJson(runMetaPath(id), null);
  if (!run) return { status: 404, body: { error: "unknown task" } };
  const plan = resumePlanFor(run);
  appendEvent(id, { type: "resume_started", line: `resume requested for ${id}` });
  appendEvent(id, { type: "resume_decision", line: `${plan.nextAction}: ${plan.reason}`, resumePlan: plan });
  if (!plan.safeToRun) {
    appendEvent(id, { type: "resume_blocked", level: plan.state === "done" ? "info" : "warn", line: plan.reason, resumePlan: plan });
    appendResumeAttempt(id, { status: plan.state === "done" ? "done" : "blocked", action: plan.nextAction, reason: plan.reason });
    return { status: 200, body: normalizedTaskDetail(readJson(runMetaPath(id), run)) };
  }
  if (run.kind === "autopilot.run") {
    const child = await startAutopilotTask({ ...(run.input || {}), resumedFrom: run.id });
    appendEvent(id, { type: "resume_done", line: `started child Autopilot task ${child.id}`, childTaskId: child.id });
    appendResumeAttempt(id, { status: "done", action: "resume_autopilot", childTaskId: child.id });
  } else if (run.kind === "mission.run") {
    const graph = run.output?.graph || null;
    const blockedNode = (graph?.nodes || []).find((node) => ["blocked", "failed"].includes(node.status));
    const child = await startMissionTask({ ...(run.input || {}), resumedFrom: run.id, resumeGraph: graph, startAtNode: blockedNode?.id || null });
    appendEvent(id, { type: "resume_done", line: blockedNode ? `started child mission task ${child.id} at ${blockedNode.id}` : `started child mission task ${child.id}`, childTaskId: child.id, nodeId: blockedNode?.id || null });
    appendResumeAttempt(id, { status: "done", action: "resume_mission", childTaskId: child.id, nodeId: blockedNode?.id || null });
    attachMissionResumeChild({ parentId: id, child, nodeId: blockedNode?.id || null });
  } else if (run.kind === "doctor") resumeDoctorTask(run);
  else if (run.kind === "ge.command") resumeGeCommandTask(run);
  else if (run.kind === "process.command") resumeProcessCommandTask(run);
  else if (run.kind === "harness.run") resumeHarnessRunTask(run);
  else if (isDataMissionNodeKind(run.kind)) resumeMissionNodeCommandTask(run);
  else {
    appendEvent(id, { type: "resume_blocked", level: "warn", line: `no resume handler for ${run.kind || "<unset>"}` });
    appendResumeAttempt(id, { status: "blocked", action: "inspect_blocker", reason: `no resume handler for ${run.kind || "<unset>"}` });
  }
  return { status: 202, body: normalizedTaskDetail(readJson(runMetaPath(id), run)) };
}

function readRequestJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += String(chunk);
      if (body.length > 1024 * 1024) {
        reject(new Error("request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body.trim()) { resolve({}); return; }
      try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

function streamRunEvents(req, res, id) {
  res.writeHead(200, {
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
    "connection": "keep-alive",
  });
  let sent = 0;
  const write = (event) => res.write(`data: ${JSON.stringify(event)}\n\n`);
  const tick = () => {
    if (res.writableEnded) return;
    const events = listEvents(id);
    for (let i = sent; i < events.length; i += 1) write(events[i]);
    sent = events.length;
    const run = readJson(runMetaPath(id), null);
    if (run && !["running", "queued"].includes(run.status)) {
      res.end();
      return;
    }
    setTimeout(tick, 300);
  };
  req.on("close", () => {});
  tick();
}

function daemonStatus(port) {
  return {
    ok: true,
    protocolVersion: DAEMON_PROTOCOL_VERSION,
    supportedTaskKinds: SUPPORTED_TASK_KINDS,
    capabilities: {
      harnessRun: true,
      missionRun: true,
      runtimeResume: true,
      eventStream: true,
      artifactChecks: true,
      interactionForms: true,
    },
    pid: process.pid,
    port,
    startedAt: readJson(META_PATH, {}).startedAt || null,
    dataDir: DAEMON_DIR,
    runs: listRunSummaries(20),
  };
}

function readdirSafe(path) {
  try {
    return existsSync(path)
      ? readdirSync(path, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)
      : [];
  } catch {
    return [];
  }
}

export function startDaemonServer({ host = "127.0.0.1", port = DEFAULT_PORT, foreground = true } = {}) {
  ensureStore();
  const backgroundChild = process.env.GE_DAEMON_BACKGROUND === "1";
  writeJson(META_PATH, { pid: process.pid, port, host, startedAt: new Date().toISOString() });
  writeFileSync(PID_PATH, String(process.pid), "utf8");
  const server = createServer((req, res) => {
    const url = new URL(req.url || "/", `http://${host}:${port}`);
    if (req.method === "GET" && url.pathname === "/health") return json(res, 200, daemonStatus(port));
    if (req.method === "GET" && url.pathname === "/api/runtime/status") return json(res, 200, daemonStatus(port));
    if (req.method === "GET" && url.pathname === "/api/tasks") {
      const full = url.searchParams.get("full") === "true";
      const limit = url.searchParams.get("limit") || 50;
      return json(res, 200, { tasks: full ? listRuns(limit).map(normalizedTaskDetail) : listRunSummaries(limit) });
    }
    if (req.method === "POST" && url.pathname === "/api/tasks") {
      readRequestJson(req).then((body) => {
        if (body.kind === "ge.command") return json(res, 202, startGeCommandTask({ argv: body.argv, command: body.command || null }));
        if (body.kind === "process.command") {
          try {
            return json(res, 202, startProcessCommandTask({ argv: body.argv, command: body.command || null }));
          } catch (error) {
            return json(res, 400, { error: error.message || String(error) });
          }
        }
        if (body.kind === "harness.run") {
          try {
            return json(res, 202, startHarnessRunTask(body.input || body));
          } catch (error) {
            return json(res, 400, { error: error.message || String(error) });
          }
        }
        if (body.kind === "mission.run") {
          startMissionTask(body).then((run) => json(res, 202, run)).catch((error) => json(res, 500, { error: error.message || String(error) }));
          return;
        }
        if (body.kind === "autopilot.run") {
          startAutopilotTask(body).then((run) => json(res, 202, run)).catch((error) => json(res, 500, { error: error.message || String(error) }));
          return;
        }
        return json(res, 400, { error: `unsupported task kind: ${body.kind || "<unset>"}` });
      }).catch((error) => json(res, 400, { error: error.message || String(error) }));
      return;
    }
    const interactionMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)\/interactions\/([^/]+)$/);
    if (req.method === "POST" && interactionMatch) {
      readRequestJson(req)
        .then((body) => {
          const result = submitInteractionResponse(decodeURIComponent(interactionMatch[1]), decodeURIComponent(interactionMatch[2]), body);
          return json(res, result.status, result.body);
        })
        .catch((error) => json(res, 400, { error: error.message || String(error) }));
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/doctor") {
      const run = startDoctorTask({ scope: url.searchParams.get("scope") || "all", command: url.searchParams.get("command") || "" });
      return json(res, 202, run);
    }
    const streamMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)\/events$/);
    if (req.method === "GET" && streamMatch) {
      if (url.searchParams.get("format") === "json") return json(res, 200, { events: listSequencedEvents(streamMatch[1]) });
      return streamRunEvents(req, res, streamMatch[1]);
    }
    const resumeMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)\/resume$/);
    if (req.method === "POST" && resumeMatch) {
      resumeTask(resumeMatch[1]).then((result) => json(res, result.status, result.body)).catch((error) => json(res, 500, { error: error.message || String(error) }));
      return;
    }
    const runMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)$/);
    if (req.method === "GET" && runMatch) {
      const run = readJson(runMetaPath(runMatch[1]), null);
      return json(res, run ? 200 : 404, run ? normalizedTaskDetail(run) : { error: "unknown task" });
    }
    return json(res, 404, { error: "not found" });
  });
  server.on("error", (error) => {
    const line = `${new Date().toISOString()} daemon listen error: ${error.message || String(error)}\n`;
    appendFileSync(LOG_PATH, line, "utf8");
    if (foreground && !backgroundChild) console.error(line.trim());
  });
  server.listen(port, host, () => {
    const line = `${new Date().toISOString()} ge daemon listening on http://${host}:${port}\n`;
    appendFileSync(LOG_PATH, line, "utf8");
    if (foreground && !backgroundChild) console.log(line.trim());
  });
  const stop = () => {
    try { server.close(); } catch {}
    try { rmSync(PID_PATH, { force: true }); } catch {}
  };
  process.on("SIGINT", () => { stop(); process.exit(0); });
  process.on("SIGTERM", () => { stop(); process.exit(0); });
  return { server, url: `http://${host}:${port}`, stop };
}

export async function getDaemonStatus({ port = Number(process.env.GE_DAEMON_PORT) || DEFAULT_PORT } = {}) {
  const response = await fetch(`http://127.0.0.1:${port}/health`, { signal: AbortSignal.timeout(1500) });
  if (!response.ok) throw new Error(`daemon health returned ${response.status}`);
  return await response.json();
}

export const __test = {
  rehydrateMissionGraphForResume,
  rehomeMissionGraph,
  commandOutput,
  harnessRunArgv,
  normalizeInteractionResponses,
  resolveHarnessRunInput,
};

export function daemonPaths() {
  return {
    dir: DAEMON_DIR,
    runsDir: RUNS_DIR,
    pidPath: PID_PATH,
    metaPath: META_PATH,
    logPath: LOG_PATH,
    defaultPort: DEFAULT_PORT,
    legacy: LEGACY_STATE_PATHS.runtime,
  };
}
