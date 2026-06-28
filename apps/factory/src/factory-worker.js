import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { FACTORY_STAGE_GRAPH, FACTORY_STAGE_IDS, nextFactoryStage } from "./factory-orchestration.js";
import { shortAgentName } from "../scripts/factory/core/naming.mjs";
import { DEFAULT_AGENT_MODEL } from "./known-models.js";
import { execStream } from "../../../tools/lib/exec-stream.mjs";
import { makeEvent } from "../../../tools/lib/events.mjs";
import { nextEventSeq, STAGE_ERROR_TYPE, stageErrorFrameData } from "@ge/run-ledger/frames";

const RELEASE_STAGES = new Set(["validate", "preview", "deploy_runtime", "poll_runtime", "publish_enterprise"]);
const CLOUD_BUILD_TERMINAL_SUCCESS = new Set(["SUCCESS"]);
const CLOUD_BUILD_TERMINAL_FAILURE = new Set(["FAILURE", "INTERNAL_ERROR", "TIMEOUT", "CANCELLED", "EXPIRED"]);
const serviceUrlCache = new Map();

// Transient/retryable failure signals. A stage failure whose message/output
// matches one of these is worth a Cloud Tasks redelivery (rate limits, quota,
// upstream 5xx, network blips); everything else is treated as a PERMANENT
// (deterministic) failure that must be acked so the run ends `failed` instead of
// dead-looping every ~30s. Conservative by design: when unsure we DON'T retry,
// because an indefinite loop on a poisoned stage is the worse failure mode and the
// terraform queue max_attempts is the only other backstop.
const TRANSIENT_FAILURE_RE = /\b(429|500|502|503|504|ECONNRESET|ETIMEDOUT|ECONNREFUSED|EAI_AGAIN|ENOTFOUND|socket hang up|timed?\s*out|timeout|deadline exceeded|rate.?limit|quota|temporarily unavailable|service unavailable|connection reset|try again|retry)\b/i;

// Pull the most useful diagnostic text out of a failed command result. Prefers the
// tail of stderr (where errors land), falls back to stdout, then to a synthesized
// "<cmd> exited <code>". Bounded so a runaway log can't blow up the ledger/error.
export function extractCommandError(cmd, args, result, { limit = 2000 } = {}) {
  const stderr = String(result?.stderr || "").trim();
  const stdout = String(result?.stdout || "").trim();
  const detail = stderr || stdout;
  const head = `${cmd} ${Array.isArray(args) ? args.join(" ") : ""}`.trim();
  const code = result?.signal ? `signal ${result.signal}` : `exit ${result?.code}`;
  if (!detail) return `${head} failed (${code}) with no output`;
  const tail = detail.length > limit ? `…${detail.slice(-limit)}` : detail;
  return `${head} failed (${code}): ${tail}`;
}

// Is this failure worth retrying? Inspect the human message AND the raw command
// output (stderr/stdout) so a transient signal anywhere triggers a redelivery.
export function isTransientFailure(message, result = null) {
  const haystack = [message, result?.stderr, result?.stdout].filter(Boolean).join("\n");
  return TRANSIENT_FAILURE_RE.test(haystack);
}

export function parseWorkerPayload(raw = null, env = process.env) {
  const source = raw || env.GE_AGENT_FACTORY_PAYLOAD || "{}";
  const payload = typeof source === "string" ? JSON.parse(source) : source;
  const stage = payload.stage || env.GE_AGENT_FACTORY_STAGE;
  if (!stage) throw new Error("Factory worker payload requires stage");
  if (!FACTORY_STAGE_GRAPH.some((item) => item.id === stage)) throw new Error(`Unknown factory stage: ${stage}`);
  const runId = payload.runId || env.GE_AGENT_FACTORY_RUN_ID || "manual";
  const itemId = payload.itemId || env.GE_AGENT_FACTORY_ITEM_ID || "manual";
  return {
    runId,
    itemId,
    workspaceId: payload.workspaceId || env.GE_AGENT_FACTORY_WORKSPACE_ID || itemId,
    stage,
    attempt: Number(payload.attempt || env.GE_AGENT_FACTORY_ATTEMPT || 1),
    targetStage: payload.targetStage || env.GE_AGENT_FACTORY_TARGET_STAGE || "verify_live",
    workspaceDir: resolve(payload.workspaceDir || env.GE_AGENT_FACTORY_WORKSPACE_DIR || "."),
    workspaceArchive: payload.workspaceArchive || env.GE_AGENT_FACTORY_WORKSPACE_ARCHIVE || "",
    artifactPrefix: payload.artifactPrefix || env.GE_AGENT_FACTORY_ARTIFACT_PREFIX || "",
    workerService: payload.workerService || env.GE_AGENT_FACTORY_WORKER_SERVICE || "ge-agent-factory-worker",
    cloud: {
      projectId: payload.cloud?.projectId || env.GOOGLE_CLOUD_PROJECT || env.GE_AGENT_FACTORY_PROJECT || "",
      projectNumber: payload.cloud?.projectNumber || env.GOOGLE_CLOUD_PROJECT_NUMBER || "",
      runtimeRegion: payload.cloud?.runtimeRegion || env.GE_AGENT_FACTORY_RUNTIME_REGION || env.GE_AGENT_FACTORY_REGION || "us-central1",
      workerServiceUrl: payload.cloud?.workerServiceUrl || env.GE_AGENT_FACTORY_WORKER_SERVICE_URL || "",
      genaiLocation: payload.cloud?.genaiLocation || env.GOOGLE_GENAI_LOCATION || "global",
      geminiEnterpriseLocation: payload.cloud?.geminiEnterpriseLocation || env.GEMINI_ENTERPRISE_LOCATION || "global",
      geminiEnterpriseApp: payload.cloud?.geminiEnterpriseApp || env.GEMINI_ENTERPRISE_APP_ID || "",
      pubsubTopic: payload.cloud?.pubsubTopic || env.GE_AGENT_FACTORY_TOPIC || "ge-agent-factory-events",
      tasksQueue: payload.cloud?.tasksQueue || env.GE_AGENT_FACTORY_QUEUE || "ge-agent-factory-stages",
      artifactBucket: payload.cloud?.artifactBucket || env.GE_AGENT_FACTORY_BUCKET || "",
      serviceAccount: payload.cloud?.serviceAccount || env.GE_AGENT_FACTORY_SERVICE_ACCOUNT || "",
    },
    options: payload.options || {},
  };
}

// Security hardening Stage B helpers. The worker submits Cloud Builds AS the
// builder SA (with an explicit logs destination, required when a non-default build
// SA is set) so the runner SA can drop cloudbuild.builds.editor. See
// docs/runbooks/security-hardening-cutover.md.
export function resolveBuilderServiceAccount(project, env = process.env) {
  const override = env.GE_AGENT_FACTORY_BUILDER_SA;
  if (override) {
    // Accept either a bare email or a full projects/.../serviceAccounts/... path.
    return override.startsWith("projects/")
      ? override
      : `projects/${project || "-"}/serviceAccounts/${override}`;
  }
  if (!project) return "";
  return `projects/${project}/serviceAccounts/ge-agent-factory-builder@${project}.iam.gserviceaccount.com`;
}

export function buildStageExecutionPlan(payload) {
  const stageDef = FACTORY_STAGE_GRAPH.find((item) => item.id === payload.stage);
  const workspaceDir = payload.workspaceDir || ".";
  const project = payload.cloud?.projectId || "";
  const region = payload.cloud?.runtimeRegion || "us-central1";
  const artifactPrefix = payload.artifactPrefix || "";
  const cloudBuildId = payload.options?.cloudBuildId || "";
  const planDataArgs = ["scripts/factory.mjs", "plan-data", "--dir", workspaceDir];
  if (payload.options?.useCaseId) planDataArgs.push("--usecase", payload.options.useCaseId);
  const SUB_DELIM = "@@@";
  const substitutionPairs = [
    `_STAGE=${payload.stage}`,
    `_ITEM_ID=${payload.itemId}`,
    // agents-cli (deploy_runtime: `scaffold enhance --name`) enforces a <=26-char
    // project name; _ITEM_ID is the (often longer) workspace id used for paths/labels,
    // so the deploy stage uses this shortened, deterministic, valid form instead.
    `_AGENT_NAME=${shortAgentName(payload.itemId || "agent")}`,
    `_WORKSPACE_ARCHIVE=${payload.workspaceArchive || ""}`,
    `_ARTIFACT_PREFIX=${artifactPrefix}`,
    `_RUNTIME_REGION=${region}`,
    `_GOOGLE_GENAI_LOCATION=${payload.cloud?.genaiLocation || "global"}`,
    `_GEMINI_ENTERPRISE_LOCATION=${payload.cloud?.geminiEnterpriseLocation || "global"}`,
    `_GEMINI_ENTERPRISE_APP_ID=${payload.cloud?.geminiEnterpriseApp || ""}`,
    `_RUN_AGENT_EVALS=${payload.options?.runAgentEvals === false ? "false" : "true"}`,
    `_RUN_AGENT_LINT=${payload.options?.runAgentLint === false ? "false" : "true"}`,
    `_RUN_AGENT_OPTIMIZE=${payload.options?.runAgentOptimize === true ? "true" : "false"}`,
    `_RUN_DEPLOYED_SMOKE=${payload.options?.runDeployedSmoke === false ? "false" : "true"}`,
    `_DISPLAY_NAME=${payload.options?.displayName || ""}`,
    `_DESCRIPTION=${payload.options?.description || ""}`,
    `_TOOL_DESCRIPTION=${payload.options?.toolDescription || ""}`,
    `_PREVIEW_PROMPT=${payload.options?.previewPrompt || "hello"}`,
  ];
  // Shared builder image (toolchain + warm uv cache). When set, stages use it
  // and skip installs; otherwise cloudbuild falls back to the public uv image.
  const builderImage = payload.cloud?.builderImage || process.env.GE_AGENT_FACTORY_BUILDER_IMAGE || "";
  if (builderImage) substitutionPairs.push(`_BUILDER_IMAGE=${builderImage}`);
  const substitutions = `^${SUB_DELIM}^` + substitutionPairs.join(SUB_DELIM);

  if (RELEASE_STAGES.has(payload.stage)) {
    if (cloudBuildId) {
      return {
        stage: payload.stage,
        owner: "cloud_build_poll",
        commands: [["gcloud", ["builds", "describe", cloudBuildId, "--project", project, "--format=json"]]],
        operation: cloudBuildId,
        nextStage: payload.stage === "deploy_runtime" ? "poll_runtime" : nextFactoryStage(payload.stage),
      };
    }
    // Security hardening Stage B: submit the build AS the builder SA so the runner
    // SA no longer needs cloudbuild.builds.editor. A user-specified build service
    // account REQUIRES an explicit logs destination (Cloud Build refuses the default
    // logs bucket) — cloudbuild.factory-stage.yaml satisfies that with
    // `options.logging: CLOUD_LOGGING_ONLY` (logs to Cloud Logging, no bucket). Do NOT
    // also pass --gcs-log-dir: build.logs_bucket is mutually exclusive with
    // CLOUD_LOGGING_ONLY (gcloud rejects the combo). The SA email is env-overridable.
    const buildServiceAccount = resolveBuilderServiceAccount(project, process.env);
    const buildArgs = [
      "builds", "submit",
      "--no-source",
      "--config", "cloudbuild.factory-stage.yaml",
      "--project", project,
      "--substitutions", substitutions,
      "--format=json",
    ];
    if (buildServiceAccount) buildArgs.push("--service-account", buildServiceAccount);
    buildArgs.push("--async");
    return {
      stage: payload.stage,
      owner: "cloud_build",
      commands: [[
        "gcloud",
        buildArgs,
      ]],
      nextStage: payload.stage === "deploy_runtime" ? "poll_runtime" : nextFactoryStage(payload.stage),
    };
  }

  const refineLocation = payload.cloud?.vertexLocation || payload.cloud?.geminiEnterpriseLocation || region;
  const commandsByStage = {
    generate_data: [["node", ["scripts/factory.mjs", "generate", "--dir", workspaceDir]]],
    package_data: [
      ["node", planDataArgs],
      ["node", ["scripts/factory.mjs", "snowfakery-recipe", "--dir", workspaceDir]],
      ["node", ["scripts/factory.mjs", "data-plan", "--dir", workspaceDir, "--project", project, "--location", region]],
    ],
    // Antigravity review+refine with the best ADK skills, then re-validated by the
    // next (validate) stage. On by default; opt out with options.refine === false
    // (REFINE=0). `--soft` makes a Vertex/harness failure degrade to the
    // deterministic code instead of failing the run — parity with local builds.
    harness_refine: payload.options?.refine === false ? [] : (() => {
      // Pin the harness review/refine model so the cloud factory reviews on the same
      // model as local (default gemini-3.5-flash) — parity with factory.js.
      const harnessModel = payload.options?.model || DEFAULT_AGENT_MODEL;
      const provider = payload.options?.harnessProvider || "antigravity-sdk";
      return [
        ["node", ["scripts/verify-harness-runtime.mjs", "--dir", workspaceDir, "--provider", provider]],
        ["node", ["scripts/factory.mjs", "harness-review", "--dir", workspaceDir, "--provider", provider, "--vertex", "true", "--project", project, "--location", refineLocation, "--model", harnessModel, "--soft", "true"]],
        ["node", ["scripts/factory.mjs", "harness-refine", "--dir", workspaceDir, "--provider", provider, "--vertex", "true", "--project", project, "--location", refineLocation, "--model", harnessModel, "--soft", "true", "--run-id", payload.runId, "--item-id", payload.itemId, "--locality", "remote", "--target-gate", "validate"]],
      ];
    })(),
    plan_deploy: [
      // Promotion gate: block the remote release if validation / spec-code trace /
      // harness verdicts haven't passed. Override per-run with options.allowUnpromoted.
      ["node", ["scripts/factory.mjs", "promotion-gate", "--dir", workspaceDir,
        ...(payload.options?.allowUnpromoted ? ["--force"] : [])]],
      ["node", [
        "scripts/run-deploy-plan.mjs",
        "--workspace-dir", workspaceDir,
        "--project-id", payload.workspaceId,
        "--repo-root", resolve("."),
        "--target", payload.options?.targetRuntime || "agent_runtime",
      ]],
    ],
    load_data: [["bash", ["mock_data/cloud/load-to-google-cloud.sh"]]],
    register_tools: [
      ["node", ["scripts/factory.mjs", "register", "--dir", workspaceDir, "--project", project, "--region", payload.cloud?.geminiEnterpriseLocation || "global", "--as", payload.options?.registerAs || "adk"]],
      ...(payload.cloud?.mcpServiceUrl
        ? [["node", ["scripts/factory.mjs", "register", "--dir", workspaceDir, "--project", project, "--region", payload.cloud?.geminiEnterpriseLocation || "global", "--as", "mcp", "--service-url", payload.cloud.mcpServiceUrl, "--agent-id", payload.workspaceId,
            ...(payload.cloud?.agentIdentityPrincipalSet ? ["--agent-principalset", payload.cloud.agentIdentityPrincipalSet] : []),
            ...(payload.options?.mcpReadOnly ? ["--read-only"] : [])]]]
        : []),
    ],
    verify_live: [["node", ["scripts/factory.mjs", "status", "--dir", workspaceDir]]],
  };

  return {
    stage: payload.stage,
    owner: stageDef?.owner || "cloud_run_service",
    commands: commandsByStage[payload.stage] || [],
    nextStage: nextFactoryStage(payload.stage),
  };
}

export function parseCloudBuildId(output = "") {
  const text = String(output || "");
  try {
    const parsed = JSON.parse(text);
    const id = parsed.id || parsed.metadata?.build?.id || parsed.metadata?.build?.name?.split("/").pop() || parsed.name?.split("/").pop();
    if (id) return id;
  } catch {}
  return text.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0] || null;
}

export function parseCloudBuildDescribe(output = "") {
  try {
    const build = JSON.parse(String(output || "{}"));
    return {
      id: build.id || build.name?.split("/").pop() || null,
      status: build.status || "UNKNOWN",
      logUrl: build.logUrl || null,
      finishTime: build.finishTime || null,
    };
  } catch {
    return { id: null, status: "UNKNOWN", logUrl: null, finishTime: null };
  }
}

export async function runCommand(command, args, { cwd = process.cwd(), env = process.env, stream = true } = {}) {
  return new Promise((resolveRun) => {
    const child = spawn(command, args, { cwd, env, stdio: stream ? "inherit" : "pipe" });
    let stdout = "";
    let stderr = "";
    if (!stream) {
      child.stdout?.on("data", (chunk) => { stdout += chunk; });
      child.stderr?.on("data", (chunk) => { stderr += chunk; });
    }
    child.on("error", (error) => resolveRun({ code: 1, stdout, stderr: error.message }));
    child.on("close", (code, signal) => resolveRun({ code: code ?? 1, signal, stdout, stderr }));
  });
}

function firestoreValue(value) {
  if (value == null) return { nullValue: null };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number" && Number.isInteger(value)) return { integerValue: String(value) };
  if (typeof value === "number") return { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(firestoreValue) } };
  if (typeof value === "object") {
    return { mapValue: { fields: Object.fromEntries(Object.entries(value).map(([k, v]) => [k, firestoreValue(v)])) } };
  }
  return { stringValue: String(value) };
}

async function getAccessToken() {
  if (process.env.GOOGLE_OAUTH_ACCESS_TOKEN) return process.env.GOOGLE_OAUTH_ACCESS_TOKEN;
  try {
    const res = await fetch("http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token", {
      headers: { "Metadata-Flavor": "Google" },
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) return (await res.json()).access_token;
  } catch {}
  const token = await runCommand("gcloud", ["auth", "print-access-token"], { stream: false });
  return token.code === 0 ? token.stdout.trim() : null;
}

function parseGsUri(uri) {
  const match = String(uri || "").match(/^gs:\/\/([^/]+)\/(.+)$/);
  if (!match) throw new Error(`Invalid GCS URI: ${uri}`);
  return { bucket: match[1], object: match[2] };
}

async function authedFetch(url, options = {}) {
  const token = await getAccessToken();
  if (!token) return { ok: false, status: 0, text: async () => "missing access token" };
  return fetch(url, {
    ...options,
    headers: {
      authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}

function logSink(payload) {
  if (!payload.artifactPrefix) return { log: () => {}, close: async () => {} };
  const target = `${payload.artifactPrefix}/${payload.stage}.ndjson`;
  let buffer = [];
  let flushing = false;

  const flush = async () => {
    if (flushing || buffer.length === 0) return;
    flushing = true;
    const batch = buffer;
    buffer = [];
    try {
      const { bucket, object } = parseGsUri(target);
      const getUrl = `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(object)}?alt=media`;
      const existing = await authedFetch(getUrl);
      const prev = existing.ok ? await existing.text() : "";
      const ndjson = (prev ? prev.replace(/\n*$/, "\n") : "") + batch.map((e) => JSON.stringify(e)).join("\n") + "\n";
      const putUrl = `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(bucket)}/o?uploadType=media&name=${encodeURIComponent(object)}`;
      await authedFetch(putUrl, { method: "POST", headers: { "content-type": "application/x-ndjson" }, body: ndjson });
    } catch {}
    flushing = false;
  };

  const intervalId = setInterval(flush, 1000);
  if (intervalId.unref) intervalId.unref();

  return {
    log: (event) => {
      buffer.push(event);
      if (buffer.length >= 50) flush();
    },
    close: async () => {
      clearInterval(intervalId);
      await flush();
    },
  };
}

export async function patchFirestoreDocument({ projectId, path, data }) {
  if (!projectId) return { skipped: true, reason: "missing projectId" };
  const token = await getAccessToken();
  if (!token) return { skipped: true, reason: "missing access token" };
  const fields = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, firestoreValue(v)]));
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const masks = Object.keys(fields).map((field) => `updateMask.fieldPaths=${encodeURIComponent(field)}`).join("&");
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${encodedPath}?${masks}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) return { ok: false, status: res.status, text: await res.text() };
  return { ok: true };
}

async function publishPubSub({ projectId, topic, event }) {
  if (!projectId || !topic) return { skipped: true };
  const url = `https://pubsub.googleapis.com/v1/projects/${projectId}/topics/${topic}:publish`;
  const res = await authedFetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      messages: [{ data: Buffer.from(JSON.stringify(event)).toString("base64") }],
    }),
  });
  if (!res.ok) return { ok: false, status: res.status, text: await res.text() };
  return { ok: true, response: await res.json() };
}

function sanitizeTaskId(value) {
  const base = String(value || "task")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 420);
  const hash = createHash("sha1").update(String(value || "")).digest("hex").slice(0, 10);
  return `${base || "task"}-${hash}`;
}

export function stageIsAtOrBefore(stage, targetStage) {
  const stageIdx = FACTORY_STAGE_IDS.indexOf(stage);
  const targetIdx = FACTORY_STAGE_IDS.indexOf(targetStage || FACTORY_STAGE_IDS.at(-1));
  return stageIdx >= 0 && targetIdx >= 0 && stageIdx <= targetIdx;
}

export function buildCloudRunJobRunBody(payload) {
  const serializedPayload = JSON.stringify(payload);
  return {
    overrides: {
      containerOverrides: [
        {
          name: "worker",
          args: ["scripts/factory-worker.mjs", "--payload", serializedPayload],
          env: [
            { name: "GE_AGENT_FACTORY_PAYLOAD", value: serializedPayload },
            { name: "GE_AGENT_FACTORY_STAGE", value: payload.stage },
            { name: "GE_AGENT_FACTORY_RUN_ID", value: payload.runId || "" },
            { name: "GE_AGENT_FACTORY_ITEM_ID", value: payload.itemId || "" },
            { name: "GE_AGENT_FACTORY_WORKSPACE_ID", value: payload.workspaceId || payload.itemId || "" },
            { name: "GE_AGENT_FACTORY_TARGET_STAGE", value: payload.targetStage || "" },
          ],
        },
      ],
    },
  };
}

export async function resolveServiceUrl(payload) {
  if (payload.cloud?.workerServiceUrl) return payload.cloud.workerServiceUrl;
  const project = payload.cloud?.projectId;
  const region = payload.cloud?.runtimeRegion || "us-central1";
  const workerService = payload.workerService || "ge-agent-factory-worker";
  if (!project) throw new Error("Cannot resolve Cloud Run service URL without projectId");
  const cacheKey = `${project}/${region}/${workerService}`;
  if (serviceUrlCache.has(cacheKey)) return serviceUrlCache.get(cacheKey);
  const result = await runCommand("gcloud", [
    "run", "services", "describe", workerService,
    "--region", region,
    "--project", project,
    "--format", "value(status.url)",
  ], { stream: false });
  const url = result.stdout.trim();
  if (result.code === 0 && url) {
    serviceUrlCache.set(cacheKey, url);
    return url;
  }
  throw new Error(`Failed to resolve Cloud Run service URL for ${workerService}: ${result.stderr || result.stdout || "empty response"}`);
}

function resolveScheduleTime(value) {
  if (!value) return null;
  if (typeof value === "string" && value.startsWith("+") && value.endsWith("s")) {
    const seconds = Number(value.slice(1, -1));
    if (Number.isFinite(seconds)) return new Date(Date.now() + seconds * 1000).toISOString();
  }
  return value;
}

export async function buildCloudTaskCommand(payload, { taskId = null, scheduleTime = null } = {}) {
  const project = payload.cloud?.projectId;
  const region = payload.cloud?.runtimeRegion || "us-central1";
  const queue = payload.cloud?.tasksQueue || "ge-agent-factory-stages";
  const serviceAccount = payload.cloud?.serviceAccount || `ge-agent-factory-runner@${project}.iam.gserviceaccount.com`;
  const id = taskId || sanitizeTaskId(`${payload.runId}-${payload.itemId}-${payload.stage}-${payload.attempt || 1}`);
  const url = await resolveServiceUrl(payload);
  const args = [
    "tasks", "create-http-task", id,
    "--queue", queue,
    "--location", region,
    "--project", project,
    "--url", url,
    "--method", "POST",
    "--header", "Content-Type: application/json",
    "--oidc-service-account-email", serviceAccount,
    "--oidc-token-audience", url,
    "--body-content", JSON.stringify(payload),
  ];
  if (scheduleTime) args.push("--schedule-time", scheduleTime);
  return ["gcloud", args];
}

export async function enqueueFactoryStage(payload, options = {}) {
  if (!payload.cloud?.projectId) return { skipped: true, reason: "missing projectId" };
  const [cmd, args] = await buildCloudTaskCommand(payload, options);
  if (options.transport === "gcloud") {
    const result = await runCommand(cmd, args, { stream: false });
    const duplicate = /ALREADY_EXISTS|already exists/i.test(`${result.stderr}\n${result.stdout}`);
    return {
      ok: result.code === 0 || duplicate,
      code: result.code,
      duplicate,
      taskId: args[2],
      stdout: result.stdout,
      stderr: result.stderr,
      command: [cmd, args],
    };
  }
  const project = payload.cloud.projectId;
  const region = payload.cloud.runtimeRegion || "us-central1";
  const queue = payload.cloud.tasksQueue || "ge-agent-factory-stages";
  const taskId = args[2];
  const parent = `projects/${project}/locations/${region}/queues/${queue}`;
  const bodyContent = args[args.indexOf("--body-content") + 1];
  const url = args[args.indexOf("--url") + 1];
  const serviceAccount = args[args.indexOf("--oidc-service-account-email") + 1];
  const audience = args[args.indexOf("--oidc-token-audience") + 1] || url;
  const task = {
    task: {
      name: `${parent}/tasks/${taskId}`,
      httpRequest: {
        httpMethod: "POST",
        url,
        headers: { "Content-Type": "application/json" },
        body: Buffer.from(bodyContent).toString("base64"),
        oidcToken: {
          serviceAccountEmail: serviceAccount,
          audience,
        },
      },
    },
  };
  const scheduleTime = resolveScheduleTime(options.scheduleTime);
  if (scheduleTime) task.task.scheduleTime = scheduleTime;
  const res = await authedFetch(`https://cloudtasks.googleapis.com/v2/${parent}/tasks`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(task),
  });
  const text = res.ok ? "" : await res.text();
  const duplicate = res.status === 409 || /ALREADY_EXISTS|already exists/i.test(text);
  return {
    ok: res.ok || duplicate,
    code: res.status,
    duplicate,
    taskId,
    stdout: res.ok ? await res.text().catch(() => "") : "",
    stderr: text,
    command: [cmd, args],
  };
}

export async function recordStageEvent(payload, event, { localDir = payload.workspaceDir } = {}) {
  const createdAt = new Date().toISOString();
  const record = { ...event, createdAt, runId: payload.runId, itemId: payload.itemId, stage: payload.stage };
  const runDir = join(localDir, "runs", payload.runId);
  await mkdir(runDir, { recursive: true });
  await writeFile(join(runDir, "factory-events.jsonl"), `${JSON.stringify(record)}\n`, { flag: "a" });

  await patchFirestoreDocument({
    projectId: payload.cloud.projectId,
    path: `factoryRuns/${payload.runId}/items/${payload.itemId}/stages/${payload.stage}`,
    data: {
      status: record.status || event.type || "event",
      updatedAt: createdAt,
      attempt: payload.attempt,
      owner: event.owner || null,
      operation: event.operation || null,
      error: event.error || null,
      nextStage: event.nextStage || null,
    },
  });
  await patchFirestoreDocument({
    projectId: payload.cloud.projectId,
    path: `factoryRuns/${payload.runId}/items/${payload.itemId}`,
    data: {
      status: record.status || event.type || "event",
      currentStage: payload.stage,
      updatedAt: createdAt,
      nextStage: event.nextStage || null,
      error: event.error || null,
    },
  });
  // Mirror into the run-level events ledger so the console can subscribe live
  // (Firestore onSnapshot) instead of polling GCS — parity with the local SQLite
  // ledger's factoryRuns/{runId}/events stream (ADR 0001 phase 2). Idempotent:
  // re-delivery of the same Cloud Task hits the same eventKey doc (merge).
  const eventStatus = record.status || event.type || "event";
  const eventKey = `${payload.itemId}_${payload.stage}_${eventStatus}`.replace(/[^A-Za-z0-9_.-]/g, "-");
  await patchFirestoreDocument({
    projectId: payload.cloud.projectId,
    path: `factoryRuns/${payload.runId}/events/${eventKey}`,
    data: {
      seq: nextEventSeq(),
      ts: createdAt,
      type: event.type || (payload.stage ? `stage_${eventStatus}` : eventStatus),
      stage: payload.stage || null,
      status: eventStatus,
      workItemId: payload.itemId || null,
      error: event.error || null,
      // Forensic detail (stack, offending cmd, attempt) for stage_error frames.
      // The cloud normalizer preserves `data` but drops unknown top-level fields,
      // so the full stack rides here and surfaces in the console Run Drawer / CLI.
      ...(event.data != null ? { data: event.data } : {}),
    },
  });
  await publishPubSub({ projectId: payload.cloud.projectId, topic: payload.cloud.pubsubTopic, event: record });
  return record;
}

// Live remote log streaming (Phase 3): mirror a stage's streamed stdout/stderr into
// the run ledger as throttled `stage_log` frames so the console drawer shows live
// command output for REMOTE runs (local runs already get a live tail via streamLogs).
// Bounded by design: batched + time-flushed + capped, and best-effort (a log write
// never breaks the stage). Text rides in `data.lines` because the cloud ledger
// normalizer preserves `data` but drops unknown top-level fields. Disabled when
// there's no cloud project (local) or GE_LEDGER_LOG_STREAM=0.
const LEDGER_LOG_FLUSH_MS = 2000;
const LEDGER_LOG_BATCH = 25;
const LEDGER_LOG_MAX_FRAMES = 150;

// The process-local MONOTONIC seq allocator (nextEventSeq) for event docs now
// lives in @ge/run-ledger/frames (imported above). The cloud ledger normalizer
// prefers `data.seq` over snapshot position, so writing a real seq on every event
// doc stops live frames from being dropped/duplicated when a doc arrives with an
// earlier `ts` (clock skew / same-second interleave of a recordStageEvent and a
// stage_log flush). A wall-clock base (µs) orders docs across stage processes by
// time; a monotonic counter keeps it strictly increasing within a process even on
// same-instant writes.

export function makeLedgerLogTap(payload, baseOnEvent, { write } = {}) {
  const enabled = Boolean(payload.cloud?.projectId) && process.env.GE_LEDGER_LOG_STREAM !== "0";
  let buf = [];
  let frame = 0;
  let timer = null;
  let truncated = false;
  // BUG 2 fix: assign a MONOTONIC seq to every frame (shared process-wide counter,
  // see nextEventSeq) so the cloud normalizer — which prefers data.seq over
  // snapshot position — orders frames by intent, not by snapshot index, and so a
  // stage_log flush and a recordStageEvent write draw from the same increasing
  // stream. Allocated before the await (below) so it's stable per call.

  // BUG 1 fix: the default writer builds the Firestore doc key from a frame index
  // that is passed in (stable per call), not read from the mutable `frame` after
  // the await. The injected test `write` is called as write(lines, frame, doc).
  const writeFrame = write
    || ((lines, myFrame, doc) => patchFirestoreDocument({
      projectId: payload.cloud.projectId,
      path: `factoryRuns/${payload.runId}/events/${`${payload.itemId}_${payload.stage}_log_${myFrame}`.replace(/[^A-Za-z0-9_.-]/g, "-")}`,
      data: {
        seq: doc.seq,
        ts: doc.ts,
        type: "stage_log",
        stage: payload.stage || null,
        workItemId: payload.itemId || null,
        data: { lines },
      },
    }));

  // BUG 1 fix: re-entrancy guard. flush() chains onto any in-flight flush so two
  // overlapping flushes (a batch-trigger `void flush()` landing while a prior
  // flush awaits its write) serialize instead of both reading the same `frame`
  // and patching the same doc. Mirrors logSink's serialization intent.
  let chain = Promise.resolve();
  const doFlush = async () => {
    if (timer) { clearTimeout(timer); timer = null; }
    if (!buf.length) return;
    const lines = buf;
    buf = [];
    if (frame >= LEDGER_LOG_MAX_FRAMES) {
      if (!truncated) {
        truncated = true;
        // Allocate the frame index + seq BEFORE the await so the doc key is
        // stable per call even if another flush is queued behind us.
        const myFrame = frame++;
        const seq = nextEventSeq();
        try { await writeFrame([`… live log truncated at ${LEDGER_LOG_MAX_FRAMES} frames — full logs in artifacts`], myFrame, { seq, ts: new Date().toISOString() }); } catch { /* best-effort */ }
      }
      return;
    }
    const myFrame = frame++;
    const seq = nextEventSeq();
    try { await writeFrame(lines, myFrame, { seq, ts: new Date().toISOString() }); } catch { /* never break the stage on a log write */ }
  };
  const flush = () => {
    chain = chain.then(doFlush, doFlush);
    return chain;
  };

  const onEvent = (event) => {
    baseOnEvent(event);
    if (!enabled) return;
    const line = typeof event?.line === "string" ? event.line.trimEnd() : "";
    if (!line) return;
    buf.push(line);
    if (buf.length >= LEDGER_LOG_BATCH) void flush();
    else if (!timer) timer = setTimeout(() => { void flush(); }, LEDGER_LOG_FLUSH_MS);
  };

  return { onEvent, stop: flush, enabled };
}

async function persistArtifacts(payload, result) {
  if (!payload.artifactPrefix) return { skipped: true };
  const summaryPath = join(payload.workspaceDir, "artifacts", `factory-${payload.stage}-result.json`);
  await mkdir(dirname(summaryPath), { recursive: true });
  const content = `${JSON.stringify(result, null, 2)}\n`;
  await writeFile(summaryPath, content);
  const target = parseGsUri(`${payload.artifactPrefix}/factory-${payload.stage}-result.json`);
  const url = `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(target.bucket)}/o?uploadType=media&name=${encodeURIComponent(target.object)}`;
  const res = await authedFetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: content,
  });
  if (!res.ok) return { ok: false, status: res.status, stderr: await res.text() };
  const archivePath = join(dirname(payload.workspaceDir), `${payload.runId}-${payload.itemId}-${payload.stage}-result.tar.gz`);
  const archived = await runCommand("tar", [
    "--exclude", ".venv",
    "--exclude", "node_modules",
    "--exclude", ".pytest_cache",
    "--exclude", "__pycache__",
    "--exclude", ".ruff_cache",
    "--exclude", ".mypy_cache",
    "--exclude", ".ge-harness",
    "--exclude", "runs",
    "-czf",
    archivePath,
    "-C",
    payload.workspaceDir,
    ".",
  ], { stream: false });
  if (archived.code !== 0) return { ok: false, status: "archive_failed", stderr: archived.stderr || archived.stdout };
  const archiveTarget = parseGsUri(`${payload.artifactPrefix}/agent-result.tar.gz`);
  const archiveUrl = `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(archiveTarget.bucket)}/o?uploadType=media&name=${encodeURIComponent(archiveTarget.object)}`;
  const archiveBytes = await readFile(archivePath);
  const archiveRes = await authedFetch(archiveUrl, {
    method: "POST",
    headers: { "content-type": "application/gzip" },
    body: archiveBytes,
  });
  if (!archiveRes.ok) return { ok: false, status: archiveRes.status, stderr: await archiveRes.text() };
  return { ok: true, status: res.status, archive: `${payload.artifactPrefix}/agent-result.tar.gz` };
}

async function restoreWorkspaceArchive(payload) {
  if (!payload.workspaceArchive) return { skipped: true };
  await mkdir(payload.workspaceDir, { recursive: true });
  const archivePath = join(dirname(payload.workspaceDir), `${payload.runId}-${payload.itemId}-workspace.tar.gz`);
  const source = parseGsUri(payload.workspaceArchive);
  const url = `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(source.bucket)}/o/${encodeURIComponent(source.object)}?alt=media`;
  const res = await authedFetch(url);
  if (!res.ok) return { ok: false, error: await res.text() };
  await writeFile(archivePath, Buffer.from(await res.arrayBuffer()));
  const extracted = await runCommand("tar", ["-xzf", archivePath, "-C", payload.workspaceDir], { stream: false });
  if (extracted.code !== 0) return { ok: false, error: extracted.stderr || extracted.stdout || "failed to extract workspace archive" };
  return { ok: true, archivePath };
}

function buildNextPayload(payload, nextStage) {
  const nextWorkspaceArchive = payload.artifactPrefix ? `${payload.artifactPrefix}/agent-result.tar.gz` : payload.workspaceArchive;
  return {
    ...payload,
    stage: nextStage,
    attempt: 1,
    workspaceDir: payload.workspaceDir,
    workspaceArchive: nextWorkspaceArchive,
    artifactPrefix: payload.artifactPrefix,
    cloud: payload.cloud,
    options: payload.options,
  };
}

function buildCloudBuildPollPayload(payload, cloudBuildId) {
  return {
    ...payload,
    attempt: (payload.attempt || 1) + 1,
    options: {
      ...(payload.options || {}),
      cloudBuildId,
    },
  };
}

function buildAdvancedPayload(payload, nextStage) {
  const nextWorkspaceArchive = payload.artifactPrefix ? `${payload.artifactPrefix}/agent-result.tar.gz` : payload.workspaceArchive;
  return {
    ...buildNextPayload(payload, nextStage),
    workspaceArchive: nextWorkspaceArchive,
    options: {
      ...(payload.options || {}),
      cloudBuildId: undefined,
    },
  };
}

export async function runFactoryWorker(payload, { dryRun = false } = {}) {
  const sink = logSink(payload);
  const restore = await restoreWorkspaceArchive(payload);
  if (restore.ok === false) {
    // Workspace archive restore failed — deterministic (bad/missing archive), so
    // ack rather than loop. retryable:false drives the non-retry HTTP ack.
    const message = `workspace archive restore failed: ${restore.error}`;
    const failed = { status: "failed", stage: payload.stage, owner: "cloud_run_service", outputs: [], nextStage: null, error: message, retryable: false };
    console.error(`[factory-worker] STAGE FAILED stage=${payload.stage} run=${payload.runId} item=${payload.itemId} retryable=false: ${message}`);
    await recordStageEvent(payload, { type: STAGE_ERROR_TYPE, status: "failed", owner: failed.owner, error: message, data: stageErrorFrameData({ message, attempt: payload.attempt }) });
    await sink.close();
    return failed;
  }
  const plan = buildStageExecutionPlan(payload);
  await recordStageEvent(payload, { type: "stage_started", status: "running", owner: plan.owner, nextStage: plan.nextStage });

  if (dryRun) {
    const shouldEnqueue = Boolean(plan.nextStage && stageIsAtOrBefore(plan.nextStage, payload.targetStage));
    const result = { status: "planned", stage: payload.stage, owner: plan.owner, commands: plan.commands, nextStage: plan.nextStage, enqueueNext: shouldEnqueue };
    await recordStageEvent(payload, { type: "stage_planned", status: "planned", owner: plan.owner, nextStage: plan.nextStage });
    await sink.close();
    return result;
  }
  sink.log(makeEvent({
    runId: payload.runId,
    agentId: payload.workspaceId || payload.itemId,
    stage: payload.stage,
    type: "stage_started",
    level: "info",
    data: { owner: plan.owner, nextStage: plan.nextStage },
  }));

  const outputs = [];
  const dataLocation = payload.cloud?.runtimeRegion || process.env.GE_AGENT_FACTORY_REGION || "us-central1";
  const genaiLocation = payload.cloud?.genaiLocation || process.env.GOOGLE_GENAI_LOCATION || "global";
  const commandEnv = {
    ...process.env,
    GOOGLE_CLOUD_PROJECT: payload.cloud?.projectId || process.env.GOOGLE_CLOUD_PROJECT,
    GCLOUD_PROJECT: payload.cloud?.projectId || process.env.GCLOUD_PROJECT,
    GOOGLE_GENAI_USE_VERTEXAI: "1",
    GOOGLE_GENAI_LOCATION: genaiLocation,
    GEMINI_ENTERPRISE_LOCATION: payload.cloud?.geminiEnterpriseLocation || process.env.GEMINI_ENTERPRISE_LOCATION || "global",
    GEMINI_ENTERPRISE_APP_ID: payload.cloud?.geminiEnterpriseApp || process.env.GEMINI_ENTERPRISE_APP_ID || "",
    GOOGLE_CLOUD_LOCATION: payload.stage === "load_data" ? dataLocation : genaiLocation,
    GE_SKIP_SERVICE_ENABLE: "1",
    GE_SKIP_BUCKET_CREATE: "1",
    GCS_BUCKET: payload.cloud?.artifactBucket || process.env.GCS_BUCKET || "",
    GCS_PREFIX: payload.artifactPrefix
      ? `runs/${payload.runId}/items/${payload.itemId}/data`
      : process.env.GCS_PREFIX || "",
    scenario: payload.workspaceId || payload.itemId || "ge_factory",
    // Shared agent-data bucket + this agent's id → load_data publishes the agent's
    // mcp-tools.json to gs://<bucket>/agents/<id>/mcp-tools.json, which the dept MCP
    // service reads at runtime (resolved via ?agent=<id>).
    GE_AGENT_DATA_BUCKET: payload.cloud?.dataBucket
      || (payload.cloud?.projectId ? `${payload.cloud.projectId}-ge-agent-data` : process.env.GE_AGENT_DATA_BUCKET || ""),
    GE_AGENT_ID: payload.workspaceId || payload.itemId || "",
    // Pin the generated-agent model on remote (default gemini-3.5-flash) and forward
    // an operator-set output-token budget so `factory generate` matches local builds.
    GE_AGENT_MODEL: payload.options?.model || process.env.GE_AGENT_MODEL || DEFAULT_AGENT_MODEL,
    ...(payload.options?.maxOutputTokens != null
      ? { GE_AGENT_MAX_OUTPUT_TOKENS: String(payload.options.maxOutputTokens) }
      : {}),
  };
  const meta = { runId: payload.runId, agentId: payload.workspaceId || payload.itemId, stage: payload.stage };
  // Mirror streamed command output into the ledger as live `stage_log` frames (remote).
  const logTap = makeLedgerLogTap(payload, sink.log);
  for (const [cmd, args] of plan.commands) {
    const cwd = cmd === "uv" || cmd === "bash" ? payload.workspaceDir : resolve(".");
    const result = await execStream(cmd, args, { cwd, env: commandEnv, onEvent: logTap.onEvent, meta });
    outputs.push({
      cmd,
      args,
      code: result.code,
      signal: result.signal || null,
      stdout: String(result.stdout || "").slice(-12000),
      stderr: String(result.stderr || "").slice(-12000),
    });
    if (result.code !== 0) {
      // Surface the REAL error: the stderr/stdout tail, not a bare "<cmd> exited N"
      // that loses every diagnostic. Classify transient vs permanent so the HTTP
      // handler can ack a deterministic failure (stop the Cloud Tasks loop) while
      // still letting genuine transient errors (5xx/timeout/quota) be redelivered.
      const message = extractCommandError(cmd, args, result);
      const retryable = isTransientFailure(message, result);
      const errorData = stageErrorFrameData({
        message,
        stack: String(result.stderr || "").trim() || null,
        cmd: `${cmd} ${Array.isArray(args) ? args.join(" ") : ""}`.trim(),
        attempt: payload.attempt,
      });
      const failed = { status: "failed", stage: payload.stage, owner: plan.owner, outputs, nextStage: null, error: message, retryable };
      await logTap.stop();
      // Single structured line so the failure is NEVER an empty ERROR log again.
      console.error(`[factory-worker] STAGE FAILED stage=${payload.stage} run=${payload.runId} item=${payload.itemId} retryable=${retryable}: ${message}`);
      sink.log(makeEvent({ ...meta, type: STAGE_ERROR_TYPE, level: "error", data: { owner: plan.owner, error: message, ...errorData } }));
      // stage_error frame carries message + stack + cmd + attempt; mapped to the
      // existing "failed" status so the reducer/StatusChip + Firestore summary render it.
      await recordStageEvent(payload, { type: STAGE_ERROR_TYPE, status: "failed", owner: plan.owner, error: message, data: errorData });
      await persistArtifacts(payload, failed);
      await sink.close();
      return failed;
    }
  }
  await logTap.stop();
  if (RELEASE_STAGES.has(payload.stage)) {
    if (payload.options?.cloudBuildId) {
      const build = parseCloudBuildDescribe(outputs.at(-1)?.stdout || "{}");
      if (!CLOUD_BUILD_TERMINAL_SUCCESS.has(build.status)) {
        if (CLOUD_BUILD_TERMINAL_FAILURE.has(build.status)) {
          const failed = {
            status: "failed",
            stage: payload.stage,
            owner: plan.owner,
            operation: payload.options.cloudBuildId,
            outputs,
            nextStage: null,
            error: `Cloud Build ${build.status}${build.logUrl ? ` (${build.logUrl})` : ""}`,
            logUrl: build.logUrl,
            // Terminal Cloud Build outcome — deterministic, ack to stop the loop.
            retryable: false,
          };
          sink.log(makeEvent({ ...meta, type: "stage_failed", level: "error", data: { owner: plan.owner, error: failed.error } }));
          await recordStageEvent(payload, { type: "stage_failed", status: "failed", owner: plan.owner, operation: payload.options.cloudBuildId, error: failed.error });
          await persistArtifacts(payload, failed);
          await sink.close();
          return failed;
        }
        const waiting = {
          status: "waiting",
          stage: payload.stage,
          owner: plan.owner,
          operation: payload.options.cloudBuildId,
          buildStatus: build.status,
          outputs,
          nextStage: payload.stage,
          logUrl: build.logUrl,
        };
        await recordStageEvent(payload, { type: "stage_waiting", status: "waiting", owner: plan.owner, operation: payload.options.cloudBuildId, nextStage: payload.stage });
        await persistArtifacts(payload, waiting);
        const queued = await enqueueFactoryStage(buildCloudBuildPollPayload(payload, payload.options.cloudBuildId), { scheduleTime: "+30s" });
        waiting.queuedNext = queued;
        await sink.close();
        return waiting;
      }
      const done = { status: "done", stage: payload.stage, owner: plan.owner, operation: payload.options.cloudBuildId, buildStatus: build.status, outputs, nextStage: plan.nextStage, logUrl: build.logUrl };
      sink.log(makeEvent({ ...meta, type: "stage_done", level: "info", data: { owner: plan.owner, nextStage: plan.nextStage } }));
      await recordStageEvent(payload, { type: "stage_done", status: "done", owner: plan.owner, operation: payload.options.cloudBuildId, nextStage: plan.nextStage });
      await persistArtifacts(payload, done);
      if (plan.nextStage && stageIsAtOrBefore(plan.nextStage, payload.targetStage)) {
        const queued = await enqueueFactoryStage(buildAdvancedPayload(payload, plan.nextStage), {
          scheduleTime: payload.stage === "deploy_runtime" ? "+120s" : null,
        });
        done.queuedNext = queued;
      }
      await sink.close();
      return done;
    }

    const cloudBuildId = parseCloudBuildId(`${outputs.at(-1)?.stdout || ""}\n${outputs.at(-1)?.stderr || ""}`);
    if (!cloudBuildId) {
      const failed = { status: "failed", stage: payload.stage, owner: plan.owner, outputs, nextStage: null, error: "Cloud Build submitted but build id was not found", retryable: false };
      sink.log(makeEvent({ ...meta, type: "stage_failed", level: "error", data: { owner: plan.owner, error: failed.error } }));
      await recordStageEvent(payload, { type: "stage_failed", status: "failed", owner: plan.owner, error: failed.error });
      await persistArtifacts(payload, failed);
      await sink.close();
      return failed;
    }
    const submitted = { status: "submitted", stage: payload.stage, owner: plan.owner, operation: cloudBuildId, outputs, nextStage: payload.stage };
    await recordStageEvent(payload, { type: "stage_submitted", status: "submitted", owner: plan.owner, operation: cloudBuildId, nextStage: payload.stage });
    await persistArtifacts(payload, submitted);
    const queued = await enqueueFactoryStage(buildCloudBuildPollPayload(payload, cloudBuildId), { scheduleTime: "+30s" });
    submitted.queuedNext = queued;
    await sink.close();
    return submitted;
  }

  const done = { status: "done", stage: payload.stage, owner: plan.owner, outputs, nextStage: plan.nextStage };
  sink.log(makeEvent({ ...meta, type: "stage_done", level: "info", data: { owner: plan.owner, nextStage: plan.nextStage } }));
  await recordStageEvent(payload, { type: "stage_done", status: "done", owner: plan.owner, nextStage: plan.nextStage });
  await persistArtifacts(payload, done);
  if (plan.nextStage && stageIsAtOrBefore(plan.nextStage, payload.targetStage)) {
    const nextPayload = buildNextPayload(payload, plan.nextStage);
    const queued = await enqueueFactoryStage(nextPayload, {
      scheduleTime: payload.stage === "deploy_runtime" ? "+120s" : null,
    });
    done.queuedNext = queued;
    await recordStageEvent(payload, {
      type: queued.ok ? "stage_next_queued" : "stage_next_queue_failed",
      status: queued.ok ? "queued" : "blocked",
      owner: "cloud_tasks",
      nextStage: plan.nextStage,
      error: queued.ok ? null : queued.stderr || "failed to enqueue next stage",
    });
  }
  await sink.close();
  return done;
}

export async function readPayloadArg(args) {
  const payloadIdx = args.indexOf("--payload");
  if (payloadIdx >= 0 && args[payloadIdx + 1]) return args[payloadIdx + 1];
  const fileIdx = args.indexOf("--payload-file");
  if (fileIdx >= 0 && args[fileIdx + 1]) return readFile(args[fileIdx + 1], "utf8");
  if (existsSync("factory-payload.json")) return readFile("factory-payload.json", "utf8");
  return process.env.GE_AGENT_FACTORY_PAYLOAD || "{}";
}
