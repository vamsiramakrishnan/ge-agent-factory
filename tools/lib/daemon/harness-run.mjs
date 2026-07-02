// tools/lib/daemon/harness-run.mjs — the "harness.run" run-kind: spawns the
// Antigravity/harness CLI (apps/factory/src/cli.js agent run) against a
// workspace, resolves Vertex project/location config, tracks the
// interaction-form request/response directory for a running agent, and
// verifies any expected artifacts the caller declared up front. Moved
// verbatim out of tools/lib/runtime-daemon.mjs.
//
// NOTE ON VERIFICATION: resolveHarnessRunInput's Vertex project/location
// resolution (via @ge/std/gcp-config's resolveGcpProject) and the harness
// CLI's own gcloud/Vertex plumbing can only be parse-verified in this
// environment — there's no ambient gcloud config or .ge.json Vertex project
// here (the same gap tracked in known-test-failures.json for "harness run
// input resolves Vertex project and global location from config"). This
// move is a byte-for-byte copy with no logic change, so behavior parity
// rests on that plus the unit tests exercising safeHarnessRunInput/
// harnessRunArgv/normalizeInteractionResponses, not a fresh live Vertex run.
import { existsSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { readJson, writeJson } from "@ge/std/json-io";
import { resolveGcpProject } from "@ge/std/gcp-config";
import * as core from "../factory-core.mjs";
import { execStream } from "../exec-stream.mjs";
import { verifyMissionArtifacts } from "../mission/mission-artifacts.mjs";
import { REPO_ROOT } from "../state-paths.mjs";
import {
  appendEvent,
  appendResumeAttempt,
  createRun,
  interactionDir,
  newTaskId,
  runMetaPath,
  runOutput,
  terminalStatusForCode,
  updateRun,
} from "./run-store.mjs";

const HARNESS_CLI = join(REPO_ROOT, "apps", "factory", "src", "cli.js");

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

export function harnessRunArgv(input = {}) {
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

export function normalizeInteractionResponses(body = {}) {
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

export function submitInteractionResponse(taskId, interactionId, body = {}) {
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

export function resolveHarnessRunInput(input = {}) {
  const cfg = core.loadConfig(input.query || {});
  const useVertex = input.vertex !== false;
  return {
    ...input,
    vertex: useVertex,
    project: resolveGcpProject({
      explicit: input.project || input.vertexProject || cfg.project,
      fallbackEnvVars: ["GCP_PROJECT_ID"],
    }),
    location: input.location
      || input.vertexLocation
      || cfg.geLocation
      || process.env.GOOGLE_CLOUD_LOCATION
      || process.env.GOOGLE_GENAI_LOCATION
      || process.env.GEMINI_ENTERPRISE_LOCATION
      || "global",
  };
}

export function expectedHarnessArtifacts(input = {}) {
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

export function inspectHarnessArtifacts(run, result = null) {
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

export function startHarnessRunTask(input = {}) {
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
  appendEvent(run.id, { type: "stage_started", stage: "harness.run", line: `$ node apps/factory/src/cli.js agent run --workspace-dir ${resolvedInput.workspaceDir || resolvedInput.workspace || "."} --agent ${resolvedInput.agent || resolvedInput.provider || "antigravity-sdk"} --stage ${resolvedInput.stage || "review"}` });

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

export function resumeHarnessRunTask(run) {
  if (!safeHarnessRunInput(run.input || {})) throw new Error("stored harness run input is not classified safe to run");
  const args = harnessRunArgv(run.input || {});
  mkdirSync(interactionDir(run.id), { recursive: true });
  updateRun(run.id, { status: "running", endedAt: null, error: null });
  appendEvent(run.id, { type: "stage_started", stage: "harness.run", line: `$ node apps/factory/src/cli.js agent run --agent ${run.input?.agent || run.input?.provider || "antigravity-sdk"} --stage ${run.input?.stage || "review"} (resume)` });
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
