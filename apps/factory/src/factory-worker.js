import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { FACTORY_STAGE_GRAPH, FACTORY_STAGE_IDS, nextFactoryStage } from "./factory-orchestration.js";
import { shortAgentName } from "@ge/std/naming";
import { resolveGcpProject } from "@ge/std/gcp-config";
import { DEFAULT_AGENT_MODEL } from "./known-models.js";
import { execStream } from "../../../tools/lib/exec-stream.mjs";
import { makeEvent } from "../../../tools/lib/events.mjs";
import { nextEventSeq, STAGE_ERROR_TYPE, STAGE_LOG_TYPE, stageErrorFrameData } from "@ge/run-ledger/frames";
import { deterministicStageTaskId } from "@ge/run-ledger/control-plane";
import { validateAgentWorkspace } from "./agent-workspace-pipeline.js";

const RELEASE_STAGES = new Set(["validate", "preview", "deploy_runtime", "poll_runtime", "publish_enterprise"]);
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

// Timeout triangle (taste-campaign 09 §C1): every HTTP task carries an explicit
// dispatchDeadline equal to the worker's Cloud Run request timeout
// (installer/terraform/cloud_run.tf: timeout = "1800s"). Cloud Tasks defaults to
// 600s, so without this any stage running longer than 10 minutes got a DUPLICATE
// concurrent redelivery while attempt 1 was still executing. 1800s is also the
// Cloud Tasks maximum. The invariant
//   dispatchDeadline === Cloud Run timeout >= longest stage expectation
// is asserted by factory-worker-timeouts.test.mjs, which reads the Terraform
// sources as text — drift on either side fails that test.
export const TASK_DISPATCH_DEADLINE = "1800s";
const CLOUD_BUILD_TERMINAL_SUCCESS = new Set(["SUCCESS"]);
const CLOUD_BUILD_TERMINAL_FAILURE = new Set(["FAILURE", "INTERNAL_ERROR", "TIMEOUT", "CANCELLED", "EXPIRED"]);
const CLOUD_BUILD_LOG_MAX_LINES_PER_POLL = 500;
const CLOUD_BUILD_LOG_READ_PAGE_SIZE = 1000;
const CLOUD_BUILD_LOG_READ_MAX_ENTRIES = 10000;
const serviceUrlCache = new Map();

// Transient/retryable failure signals. A stage failure whose message/output
// matches one of these is worth a Cloud Tasks redelivery (rate limits, quota,
// upstream 5xx, network blips); everything else is treated as a PERMANENT
// (deterministic) failure that must be acked so the run ends `failed` instead of
// dead-looping every ~30s. Conservative by design: when unsure we DON'T retry,
// because an indefinite loop on a poisoned stage is the worse failure mode and the
// terraform queue max_attempts is the only other backstop.
const TRANSIENT_FAILURE_RE = /\b(429|500|502|503|504|ECONNRESET|ETIMEDOUT|ECONNREFUSED|EAI_AGAIN|ENOTFOUND|socket hang up|timed?\s*out|timeout|deadline exceeded|rate.?limit|quota|temporarily unavailable|service unavailable|connection reset|try again|retry)\b/i;

// Structured stage logging (taste-campaign 09 §C9). One JSON object per line,
// Cloud Logging jsonPayload convention: `severity` + `message` + queryable fields
// ({runId, itemId, stage, attempt, ...}). Cloud Run captures stdout/stderr and
// Cloud Logging indexes the JSON automatically, so every stage's logs become
// filterable by runId with zero infra; Error Reporting picks up severity=ERROR
// entries for free. The human-readable text stays inside `message`. ERROR/WARNING
// go to stderr (local readability parity with the old console.error lines).
export function logStage(severity, { message, ...fields } = {}) {
  const line = JSON.stringify({ severity, message, ...fields });
  if (severity === "ERROR" || severity === "WARNING" || severity === "CRITICAL") console.error(line);
  else console.log(line);
}

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

function firstDiagnosticLine(text = "", { limit = 500 } = {}) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const line = lines.find((item) => /PERMISSION_DENIED|Permission ['"][^'"]+['"] denied|403 .*denied/i.test(item))
    || lines.find((item) => /(error|failed|exception|traceback|permission|denied|invalid|threshold|mean_score|timeout|deadline|quota|not found)/i.test(item))
    || lines.at(-1)
    || "";
  if (!line) return null;
  return line.length > limit ? `…${line.slice(-limit)}` : line;
}

export function classifyFailureText(text = "", { stage = "" } = {}) {
  const detail = String(text || "");
  const firstError = firstDiagnosticLine(detail);
  let classification = "stage_command";
  let fixHint = "Open the stage result and run logs; the command failed before the factory could classify it more specifically.";
  let retryable = false;

  if (/Request contains an invalid argument|arguments? length|--substitutions.*too long|too large|unmatched.*substitution|invalid build config|cloudbuild\.factory-stage\.yaml/i.test(detail)) {
    classification = "cloud_build_config";
    fixHint = "Fix the shared Cloud Build stage config/substitutions contract, then rebuild and redeploy the worker image.";
  } else if (/(restore-workspace|workspace archive restore|workspace archive|agent-result\.tar\.gz|workspace\.tar\.gz)/i.test(detail) && /(gs:\/\/|gcs|storage|not found|404|archive|restore)/i.test(detail)) {
    classification = "artifact_storage";
    fixHint = "Check the workspace/archive GCS URI and runner or builder service-account storage permissions.";
  } else if (/ge-factory-run-stage not found|_BUILDER_IMAGE=.*not found|set GE_AGENT_FACTORY_BUILDER_IMAGE|builder image .*missing|builder image .*not found/i.test(detail)) {
    classification = "builder_image";
    fixHint = "Rebuild the shared builder image and bind it through GE_AGENT_FACTORY_BUILDER_IMAGE or Terraform.";
  } else if (/invalid autorater model resource name|judge_autorater_config\.autorater_model|autorater_model/i.test(detail)) {
    classification = "eval_config";
    fixHint = "Use a fully qualified Vertex autorater model resource for the eval judge model: projects/{project}/locations/{location}/publishers/google/models/{model}.";
  } else if (/aiplatform\.endpoints\.predict|permission.*predict|PERMISSION_DENIED.*(aiplatform|predict)|aiplatform.*PERMISSION_DENIED/i.test(detail)) {
    classification = "iam_vertex_predict";
    fixHint = "Grant the builder service account Vertex AI prediction access, then rerun the stage.";
  } else if (/(discoveryengine|gemini enterprise)/i.test(detail) && /(PERMISSION_DENIED|permission|denied|403)/i.test(detail)) {
    classification = "iam_discovery_engine";
    fixHint = "Grant the builder/runtime identity Discovery Engine access for the Gemini Enterprise app.";
  } else if (/resourcemanager\.projects\.(get|set)IamPolicy|project IAM policy/i.test(detail) && /(PERMISSION_DENIED|permission|denied|403)/i.test(detail)) {
    classification = "iam_project_policy";
    fixHint = "Grant the builder service account the factory's Agent Identity IAM Binder role, then retry the operation-aware deploy stage.";
  } else if (/agents-cli eval generate\/grade|eval generate|eval grade|Inference timed out after .*Vertex AI|eval case\(s\) errored|mean_score .*below threshold|thresholded metrics missing|no mean_score|behavior_contract_judge|tool_use_quality|final_response_quality/i.test(detail)) {
    classification = "workload_eval";
    fixHint = "The generated agent reached the behavior-contract eval gate; inspect eval-verdict.json and eval stdout logs, then refine the spec/tools or eval runtime location.";
  } else if (/workspace archive restore|Invalid GCS URI|Failed to fetch GCS|storage\.googleapis\.com/i.test(detail)) {
    classification = "artifact_storage";
    fixHint = "Check the workspace/archive GCS URI and runner or builder service-account storage permissions.";
  } else if (TRANSIENT_FAILURE_RE.test(detail)) {
    classification = "transient";
    fixHint = "Retry the stage after the upstream service or quota condition clears.";
    retryable = true;
  } else if (stage && RELEASE_STAGES.has(stage) && /Cloud Build (FAILURE|INTERNAL_ERROR|TIMEOUT|CANCELLED|EXPIRED)/i.test(detail)) {
    classification = "cloud_build_failure";
    fixHint = "Open the Cloud Build log and the persisted factory stage result artifact for the failing step.";
  }

  return { classification, firstError, fixHint, retryable };
}

export function classifyStageFailure({ stage = "", error = "", message = "", outputs = [], result = null } = {}) {
  const outputText = Array.isArray(outputs)
    ? outputs.map((item) => [item?.stderr, item?.stdout].filter(Boolean).join("\n")).join("\n")
    : "";
  const detail = [message, error, outputText, result?.stderr, result?.stdout].filter(Boolean).join("\n");
  return classifyFailureText(detail, { stage });
}

function applyFailureDiagnosis(failure, context = {}) {
  const diagnosis = classifyStageFailure({
    stage: failure?.stage || context.stage,
    error: failure?.error,
    message: context.message,
    outputs: failure?.outputs || context.outputs,
    result: context.result,
  });
  return {
    ...failure,
    classification: failure?.classification || diagnosis.classification,
    firstError: failure?.firstError || diagnosis.firstError,
    fixHint: failure?.fixHint || diagnosis.fixHint,
    retryable: failure?.retryable ?? diagnosis.retryable,
  };
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
      projectId: resolveGcpProject({ explicit: payload.cloud?.projectId, env, fallbackEnvVars: ["GE_AGENT_FACTORY_PROJECT"] }) || "",
      tasksProjectId: payload.cloud?.tasksProjectId || env.GE_AGENT_FACTORY_TASKS_PROJECT || "",
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
      dataBucket: payload.cloud?.dataBucket || env.GE_AGENT_DATA_BUCKET || "",
      mcpServiceUrl: payload.cloud?.mcpServiceUrl || env.GE_AGENT_FACTORY_MCP_SERVICE_URL || "",
      agentIdentityPrincipalSet: payload.cloud?.agentIdentityPrincipalSet || env.GE_AGENT_IDENTITY_PRINCIPAL_SET || "",
      vertexLocation: payload.cloud?.vertexLocation || env.GOOGLE_GENAI_LOCATION || "",
      builderImage: payload.cloud?.builderImage || env.GE_AGENT_FACTORY_BUILDER_IMAGE || "",
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

export function defaultBuilderImage({ project, region } = {}) {
  if (!project || !region) return "";
  return `${region}-docker.pkg.dev/${project}/ge-agent-factory/ge-agent-factory-builder:latest`;
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
    `_EVAL_JUDGE_SAMPLES=${payload.options?.evalJudgeSamples || process.env.GE_EVAL_JUDGE_SAMPLES || "5"}`,
    `_DISPLAY_NAME=${payload.options?.displayName || ""}`,
    `_DESCRIPTION=${payload.options?.description || ""}`,
    `_TOOL_DESCRIPTION=${payload.options?.toolDescription || ""}`,
    `_PREVIEW_PROMPT=${payload.options?.previewPrompt || "hello"}`,
  ];
  // Shared builder image (toolchain + warm uv cache + ge-factory-run-stage).
  // Terraform sets this env on the worker; the deterministic fallback matches
  // `ge images build builder` so ad-hoc workers still submit runnable stages.
  const builderImage = payload.cloud?.builderImage
    || process.env.GE_AGENT_FACTORY_BUILDER_IMAGE
    || defaultBuilderImage({ project, region });
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

  const refineLocation = payload.cloud?.vertexLocation
    || payload.cloud?.genaiLocation
    || payload.cloud?.geminiEnterpriseLocation
    || "global";
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
      // model as local — parity with factory.js/provisionLocal, which pin the
      // refinementModel here (falling back to the agent model, then the default).
      const harnessModel = payload.options?.refinementModel || payload.options?.model || DEFAULT_AGENT_MODEL;
      const provider = payload.options?.harnessProvider || "antigravity-sdk";
      return [
        ["node", ["scripts/verify-harness-runtime.mjs", "--dir", workspaceDir, "--provider", provider]],
        ["node", ["scripts/factory.mjs", "harness-review", "--dir", workspaceDir, "--provider", provider, "--vertex", "true", "--project", project, "--location", refineLocation, "--model", harnessModel, "--soft", "true"]],
        ["node", ["scripts/factory.mjs", "harness-refine", "--dir", workspaceDir, "--provider", provider, "--vertex", "true", "--project", project, "--location", refineLocation, "--model", harnessModel, "--soft", "true", "--run-id", payload.runId, "--item-id", payload.itemId, "--locality", "remote", "--target-gate", "validate"]],
      ];
    })(),
    plan_deploy: [
      // Promotion gate: block the remote release if validation / spec-code trace /
      // harness verdicts haven't passed. Override per-run with options.allowUnpromoted
      // (payload field, distinct from CONFIG_FIELDS.allowUnpromoted in tools/lib/config-schema.mjs).
      ["node", ["scripts/factory.mjs", "promotion-gate", "--dir", workspaceDir,
        ...(payload.options?.allowUnpromoted ? ["--force"] : [])]],
      ["node", [
        "scripts/run-deploy-plan.mjs",
        "--workspace-dir", workspaceDir,
        "--project-id", payload.workspaceId,
        "--repo-root", resolve("."), // cwd-coupling-ok: the cloud worker runs with WORKDIR pinned by the Dockerfile, so cwd is the deterministic repo root

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
    const failedStep = (build.steps || []).find((step) => ["FAILURE", "INTERNAL_ERROR", "TIMEOUT", "CANCELLED", "EXPIRED"].includes(String(step.status || "").toUpperCase()));
    return {
      id: build.id || build.name?.split("/").pop() || null,
      status: build.status || "UNKNOWN",
      logUrl: build.logUrl || null,
      finishTime: build.finishTime || null,
      failureInfo: build.failureInfo || null,
      failedStep: failedStep
        ? {
            id: failedStep.id || null,
            name: failedStep.name || null,
            status: failedStep.status || null,
            exitCode: failedStep.exitCode ?? null,
          }
        : null,
    };
  } catch {
    return { id: null, status: "UNKNOWN", logUrl: null, finishTime: null, failureInfo: null, failedStep: null };
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

export function firestoreValue(value) {
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

export async function readJsonGsUri(uri) {
  try {
    const { bucket, object } = parseGsUri(uri);
    const url = `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(object)}?alt=media`;
    const res = await authedFetch(url);
    const text = await res.text();
    if (!res.ok) return { ok: false, status: res.status, error: text };
    return { ok: true, json: JSON.parse(text) };
  } catch (error) {
    return { ok: false, status: 0, error: error?.message || String(error) };
  }
}

export function stageResultArtifactCandidates(artifactPrefix, stage) {
  if (!artifactPrefix || !stage) return [];
  return [
    `${artifactPrefix}/factory-${stage}-result.json`,
    `${artifactPrefix}/files/./artifacts/factory-${stage}-result.json`,
  ];
}

export function cloudBuildPollArtifactName(stage) {
  return `factory-${stage}-poll-result.json`;
}

export function cloudBuildSubmissionArtifactName(stage) {
  return `factory-${stage}-cloud-build.json`;
}

async function readStageResultArtifact(payload, stage = payload.stage) {
  if (!payload.artifactPrefix) return null;
  const candidates = stageResultArtifactCandidates(payload.artifactPrefix, stage);
  let firstReadable = null;
  for (const uri of candidates) {
    const result = await readJsonGsUri(uri);
    if (!result.ok || !result.json || typeof result.json !== "object") continue;
    const found = { uri, result: result.json };
    firstReadable ||= found;
    if (!["waiting", "submitted"].includes(String(result.json.status || ""))) return found;
  }
  return firstReadable;
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
  const project = payload.cloud?.tasksProjectId || payload.cloud?.projectId;
  const region = payload.cloud?.runtimeRegion || "us-central1";
  const queue = payload.cloud?.tasksQueue || "ge-agent-factory-stages";
  const serviceAccount = payload.cloud?.serviceAccount || `ge-agent-factory-runner@${project}.iam.gserviceaccount.com`;
  const id = taskId || deterministicStageTaskId(payload);
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
  // NOTE: the gcloud fallback transport cannot set dispatchDeadline —
  // `gcloud tasks create-http-task` has no flag for it — so tasks created this way
  // keep the 600s Cloud Tasks default. The REST path below (the default transport,
  // used by the worker's own stage-to-stage enqueues) sets TASK_DISPATCH_DEADLINE.
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
      // Match the worker's Cloud Run timeout so a long stage is never redelivered
      // concurrently while attempt 1 still executes (see TASK_DISPATCH_DEADLINE).
      dispatchDeadline: TASK_DISPATCH_DEADLINE,
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
  const classification = event.classification || event.data?.classification || null;
  const firstError = event.firstError || event.data?.firstError || null;
  const fixHint = event.fixHint || event.data?.fixHint || null;
  const retryable = event.retryable ?? event.data?.retryable ?? null;
  const itemProjection = projectStageEventToItem(payload, event);
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
      classification,
      firstError,
      fixHint,
      retryable,
      nextStage: event.nextStage || null,
    },
  });
  await patchFirestoreDocument({
    projectId: payload.cloud.projectId,
    path: `factoryRuns/${payload.runId}/items/${payload.itemId}`,
    data: {
      status: itemProjection.status,
      currentStage: itemProjection.currentStage,
      updatedAt: createdAt,
      nextStage: event.nextStage || null,
      error: event.error || null,
      classification,
      firstError,
      fixHint,
      retryable,
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
      data: {
        ...(event.data && typeof event.data === "object" ? event.data : (event.data != null ? { value: event.data } : {})),
        ...(classification ? { classification } : {}),
        ...(firstError ? { firstError } : {}),
        ...(fixHint ? { fixHint } : {}),
        ...(retryable != null ? { retryable } : {}),
      },
    },
  });
  await publishPubSub({ projectId: payload.cloud.projectId, topic: payload.cloud.pubsubTopic, event: record });
  return record;
}

export function projectStageEventToItem(payload, event) {
  const status = event.status || event.type || "event";
  const advances = Boolean(event.nextStage) && (event.type === "stage_done" || event.type === "stage_next_queued");
  return {
    status: event.type === "stage_done" && advances ? "running" : status,
    currentStage: advances ? event.nextStage : payload.stage,
  };
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
        type: STAGE_LOG_TYPE,
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

async function writeRunLedgerFrame(payload, event, { docSuffix = "" } = {}) {
  const ts = new Date().toISOString();
  const seq = nextEventSeq();
  const type = event.type || "event";
  const status = event.status || null;
  const data = event.data && typeof event.data === "object"
    ? event.data
    : (event.data != null ? { value: event.data } : {});
  const keyBase = docSuffix || `${payload.itemId}_${payload.stage}_${type}_${seq}`;
  const docKey = keyBase.replace(/[^A-Za-z0-9_.-]/g, "-");
  await patchFirestoreDocument({
    projectId: payload.cloud.projectId,
    path: `factoryRuns/${payload.runId}/events/${docKey}`,
    data: {
      seq,
      ts,
      type,
      stage: event.stage ?? payload.stage ?? null,
      status,
      workItemId: event.workItemId ?? payload.itemId ?? null,
      error: event.error ?? null,
      data,
    },
  });
  await publishPubSub({
    projectId: payload.cloud.projectId,
    topic: payload.cloud.pubsubTopic,
    event: {
      ...event,
      createdAt: ts,
      runId: payload.runId,
      itemId: payload.itemId,
      stage: event.stage ?? payload.stage,
    },
  }).catch((error) => {
    logStage("WARNING", {
      message: `Pub/Sub event mirror failed: ${error?.message || String(error)}`,
      runId: payload.runId,
      itemId: payload.itemId,
      stage: payload.stage,
    });
  });
}

export function cloudBuildLogDelta(text = "", offset = 0, { maxLines = CLOUD_BUILD_LOG_MAX_LINES_PER_POLL } = {}) {
  const raw = String(text || "").replace(/\r\n/g, "\n").split("\n");
  if (raw.at(-1) === "") raw.pop();
  const currentOffset = Number.isFinite(Number(offset)) ? Math.max(0, Number(offset)) : 0;
  const start = currentOffset > raw.length ? 0 : currentOffset;
  let lines = raw.slice(start).filter((line) => line.trim());
  const droppedLines = maxLines > 0 && lines.length > maxLines ? lines.length - maxLines : 0;
  if (droppedLines > 0) {
    lines = [`… skipped ${droppedLines} Cloud Build log line(s) already persisted to Cloud Logging`, ...lines.slice(-maxLines)];
  }
  return { lines, nextOffset: raw.length, droppedLines };
}

export function progressFromCloudBuildLogLine(line = "") {
  const text = String(line || "");
  const unprefixed = text.replace(/^Step #\d+(?: - "[^"]+")?:\s*/, "").trim();
  const marker = unprefixed.match(/^::ge-progress\s+([A-Za-z0-9_.:-]+)(?:\s+(.*))?$/);
  if (marker) {
    return {
      phase: marker[1],
      message: marker[2]?.trim() || marker[1],
    };
  }
  if (/Starting Step #\d+ - "restore-workspace"/.test(text)) {
    return { phase: "cloud_build.restore_workspace", message: "restore workspace archive" };
  }
  if (/Starting Step #\d+ - "run-stage"/.test(text)) {
    return { phase: "cloud_build.run_stage", message: "run factory stage" };
  }
  if (/Starting Step #\d+ - "persist-workspace"/.test(text)) {
    return { phase: "cloud_build.persist_workspace", message: "persist workspace archive" };
  }
  if (/Starting Step #\d+ - "persist-result"/.test(text)) {
    return { phase: "cloud_build.persist_result", message: "persist stage result" };
  }
  if (/Starting Step #\d+ - "fail-stage-if-needed"/.test(text)) {
    return { phase: "cloud_build.fail_gate", message: "check stage result" };
  }
  return null;
}

function cloudBuildLogEntryOrdinal(entry = {}, buildId = "") {
  const raw = String(entry.insertId || "");
  const prefix = buildId ? `${buildId}-` : "";
  if (prefix && raw.startsWith(prefix)) {
    const ordinal = Number(raw.slice(prefix.length));
    if (Number.isFinite(ordinal)) return ordinal;
  }
  return null;
}

export function cloudBuildLogLinesFromEntries(entries = [], buildId = "") {
  return [...entries]
    .filter((entry) => typeof entry?.textPayload === "string")
    .sort((a, b) => {
      const aOrdinal = cloudBuildLogEntryOrdinal(a, buildId);
      const bOrdinal = cloudBuildLogEntryOrdinal(b, buildId);
      if (aOrdinal != null && bOrdinal != null && aOrdinal !== bOrdinal) return aOrdinal - bOrdinal;
      if (aOrdinal != null && bOrdinal == null) return -1;
      if (aOrdinal == null && bOrdinal != null) return 1;
      const byTimestamp = String(a.timestamp || "").localeCompare(String(b.timestamp || ""));
      if (byTimestamp) return byTimestamp;
      return String(a.insertId || "").localeCompare(String(b.insertId || ""));
    })
    .map((entry) => entry.textPayload);
}

export async function readCloudBuildLogsFromLogging(projectId, cloudBuildId, { fetchLogs = authedFetch, pageSize = CLOUD_BUILD_LOG_READ_PAGE_SIZE, maxEntries = CLOUD_BUILD_LOG_READ_MAX_ENTRIES } = {}) {
  if (!projectId || !cloudBuildId) return { ok: false, lines: [], error: "missing projectId or cloudBuildId" };
  const url = "https://logging.googleapis.com/v2/entries:list";
  const filter = [
    'resource.type="build"',
    `resource.labels.build_id="${cloudBuildId}"`,
    `logName="projects/${projectId}/logs/cloudbuild"`,
  ].join(" AND ");
  let pageToken = "";
  const entries = [];
  do {
    const res = await fetchLogs(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        resourceNames: [`projects/${projectId}`],
        filter,
        orderBy: "timestamp asc",
        pageSize,
        ...(pageToken ? { pageToken } : {}),
      }),
    });
    const text = await res.text();
    if (!res.ok) return { ok: false, lines: [], error: text || `Cloud Logging entries:list failed (${res.status})` };
    const json = text ? JSON.parse(text) : {};
    entries.push(...(Array.isArray(json.entries) ? json.entries : []));
    pageToken = json.nextPageToken || "";
  } while (pageToken && entries.length < maxEntries);
  return {
    ok: true,
    lines: cloudBuildLogLinesFromEntries(entries.slice(0, maxEntries), cloudBuildId),
    truncated: Boolean(pageToken),
  };
}

export async function mirrorCloudBuildLogs(payload, cloudBuildId, { run = runCommand, readLogs = readCloudBuildLogsFromLogging, makeTap = makeLedgerLogTap, writeProgress = writeRunLedgerFrame } = {}) {
  const previousOffset = Number(payload.options?.cloudBuildLogOffset || 0);
  if (!cloudBuildId || !payload.cloud?.projectId) return { ok: false, offset: previousOffset, mirroredLines: 0, progressEvents: 0, skipped: true };
  const result = await run("gcloud", ["builds", "log", cloudBuildId, "--project", payload.cloud.projectId], { stream: false });
  let source = "gcloud";
  let logText = result.stdout || "";
  let readError = result.code === 0 ? null : (result.stderr || result.stdout || "gcloud builds log failed");
  if (result.code !== 0 || !String(logText || "").trim()) {
    const logged = await readLogs(payload.cloud.projectId, cloudBuildId).catch((error) => ({
      ok: false,
      lines: [],
      error: error?.message || String(error),
    }));
    if (logged.ok && logged.lines.length) {
      source = "cloud_logging";
      logText = `${logged.lines.join("\n")}\n`;
      readError = null;
    } else if (result.code === 0) {
      readError = logged.error || "Cloud Build log command returned no output";
    } else {
      readError = [readError, logged.error].filter(Boolean).join("\n");
    }
  }
  if (readError) {
    return {
      ok: false,
      offset: previousOffset,
      mirroredLines: 0,
      progressEvents: 0,
      error: readError,
    };
  }
  const delta = cloudBuildLogDelta(logText, previousOffset);
  const tap = makeTap(payload, () => {}, {
    write: (lines, myFrame, doc) => patchFirestoreDocument({
      projectId: payload.cloud.projectId,
      path: `factoryRuns/${payload.runId}/events/${`${payload.itemId}_${payload.stage}_cloudbuild_${previousOffset}_${myFrame}`.replace(/[^A-Za-z0-9_.-]/g, "-")}`,
      data: {
        seq: doc.seq,
        ts: doc.ts,
        type: STAGE_LOG_TYPE,
        stage: payload.stage || null,
        workItemId: payload.itemId || null,
        data: { lines, source: "cloud_build", logSource: source, buildId: cloudBuildId, offset: previousOffset },
      },
    }),
  });
  for (const line of delta.lines) tap.onEvent({ line });
  await tap.stop();

  let progressEvents = 0;
  for (const line of delta.lines) {
    const progress = progressFromCloudBuildLogLine(line);
    if (!progress) continue;
    progressEvents += 1;
    await writeProgress(payload, {
      type: "stage_progress",
      status: "running",
      data: {
        ...progress,
        buildId: cloudBuildId,
      },
    }, { docSuffix: `${payload.itemId}_${payload.stage}_progress_${delta.nextOffset}_${progressEvents}` }).catch((error) => {
      logStage("WARNING", {
        message: `Stage progress persistence failed: ${error?.message || String(error)}`,
        runId: payload.runId,
        itemId: payload.itemId,
        stage: payload.stage,
        buildId: cloudBuildId,
      });
    });
  }
  return { ok: true, offset: delta.nextOffset, mirroredLines: delta.lines.length, progressEvents, droppedLines: delta.droppedLines, source };
}

async function persistArtifacts(payload, result, { artifactName = `factory-${payload.stage}-result.json` } = {}) {
  if (!payload.artifactPrefix) return { skipped: true };
  const summaryPath = join(payload.workspaceDir, "artifacts", artifactName);
  await mkdir(dirname(summaryPath), { recursive: true });
  const content = `${JSON.stringify(result, null, 2)}\n`;
  await writeFile(summaryPath, content);
  const target = parseGsUri(`${payload.artifactPrefix}/${artifactName}`);
  const url = `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(target.bucket)}/o?uploadType=media&name=${encodeURIComponent(target.object)}`;
  const res = await authedFetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: content,
  });
  if (!res.ok) return { ok: false, status: res.status, stderr: await res.text() };
  if (!shouldPersistMutableWorkspaceArchive(payload, result)) {
    return { ok: true, status: res.status, archive: null, skippedArchive: true };
  }
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

function shouldPersistMutableWorkspaceArchive(payload, result) {
  if (result?.status !== "done") return false;
  if (RELEASE_STAGES.has(payload.stage) && payload.options?.cloudBuildId) return false;
  return true;
}

function stableWorkspaceArchive(payload) {
  if (payload.artifactPrefix) return `${payload.artifactPrefix}/workspace.tar.gz`;
  return payload.workspaceArchive || "";
}

async function persistWorkspaceSnapshot(payload) {
  const archiveUri = stableWorkspaceArchive(payload);
  if (!archiveUri) return { skipped: true };
  const archivePath = join(dirname(payload.workspaceDir), `${payload.runId}-${payload.itemId}-${payload.stage}-workspace.tar.gz`);
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
  const target = parseGsUri(archiveUri);
  const url = `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(target.bucket)}/o?uploadType=media&name=${encodeURIComponent(target.object)}`;
  const archiveBytes = await readFile(archivePath);
  const res = await authedFetch(url, {
    method: "POST",
    headers: { "content-type": "application/gzip" },
    body: archiveBytes,
  });
  if (!res.ok) return { ok: false, status: res.status, stderr: await res.text() };
  return { ok: true, status: res.status, archive: archiveUri };
}

function artifactPersisted(result) {
  return result?.skipped === true || result?.ok !== false;
}

function artifactPersistenceFailure(payload, result, persisted) {
  const detail = String(persisted?.stderr || persisted?.error || persisted?.status || "unknown persistence failure").trim();
  const message = `artifact persistence failed for ${payload.stage}: ${detail}`;
  return {
    ...result,
    status: "failed",
    nextStage: null,
    error: message,
    classification: "artifact_storage",
    firstError: message,
    fixHint: "Check the artifact bucket path and worker service-account storage permissions; rerun after the workspace archive can be written.",
    retryable: false,
    persistResult: persisted,
  };
}

async function persistArtifactsOrFail(payload, result) {
  const persisted = await persistArtifacts(payload, result);
  if (!artifactPersisted(persisted)) {
    const failed = artifactPersistenceFailure(payload, result, persisted);
    await persistArtifacts(payload, failed).catch(() => null); // best-effort: this is the fallback after canonical artifact persistence already failed
    return { ok: false, failed, persisted };
  }
  if (result?.status === "done") {
    const workspace = await persistWorkspaceSnapshot(payload);
    if (!artifactPersisted(workspace)) {
      const failed = artifactPersistenceFailure(payload, result, workspace);
      await persistArtifacts(payload, failed).catch(() => null); // best-effort: this is the fallback after canonical workspace persistence already failed
      return { ok: false, failed, persisted: workspace };
    }
    return { ok: true, persisted, workspace };
  }
  return { ok: true, persisted };
}

async function materializeCanonicalValidateArtifacts(payload) {
  if (payload.stage !== "validate") return { skipped: true };
  await rm(payload.workspaceDir, { recursive: true, force: true });
  const restore = await restoreWorkspaceArchive(payload);
  if (restore.ok === false) {
    return {
      ok: false,
      status: "restore_failed",
      error: `post-validate workspace restore failed: ${restore.error}`,
    };
  }

  let report = null;
  try {
    report = await validateAgentWorkspace({
      workspaceDir: payload.workspaceDir,
      manifestPath: join(payload.workspaceDir, "workspace.json"),
      workspaceId: payload.workspaceId || payload.itemId,
      repoRoot: REPO_ROOT,
      testsRequested: true,
      testExitCode: 0,
      source: "cloud_build",
    });
  } catch (error) {
    return {
      ok: false,
      status: "validation_exception",
      error: `post-validate canonical validation failed: ${error?.message || String(error)}`,
    };
  }

  const workspace = await persistWorkspaceSnapshot(payload);
  if (!artifactPersisted(workspace)) {
    return {
      ok: false,
      status: "archive_failed",
      error: `post-validate workspace archive persistence failed: ${workspace?.stderr || workspace?.error || workspace?.status || "unknown persistence failure"}`,
      report: report ? { ok: report.ok, summary: report.summary, specCodeTrace: report.specCodeTrace } : null,
      workspace,
    };
  }

  if (report?.ok !== true) {
    const failedChecks = (report?.checks || [])
      .filter((check) => !check.ok)
      .slice(0, 8)
      .map((check) => `${check.group || "check"}:${check.id || "unknown"}`);
    return {
      ok: false,
      status: "validation_failed",
      error: `post-validate canonical validation report is not passing${failedChecks.length ? ` (${failedChecks.join(", ")})` : ""}`,
      report: { ok: report.ok, summary: report.summary, specCodeTrace: report.specCodeTrace },
      workspace,
    };
  }

  return {
    ok: true,
    status: "done",
    report: { ok: report.ok, summary: report.summary, specCodeTrace: report.specCodeTrace },
    workspace,
  };
}

function nextStageWorkspaceArchive(payload) {
  return stableWorkspaceArchive(payload) || payload.workspaceArchive;
}

function buildNextPayload(payload, nextStage) {
  const nextWorkspaceArchive = nextStageWorkspaceArchive(payload);
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

function buildCloudBuildPollPayload(payload, cloudBuildId, optionPatch = {}) {
  return {
    ...payload,
    attempt: (payload.attempt || 1) + 1,
    options: {
      ...(payload.options || {}),
      cloudBuildId,
      ...optionPatch,
    },
  };
}

function buildAdvancedPayload(payload, nextStage) {
  return {
    ...buildNextPayload(payload, nextStage),
    workspaceArchive: nextStageWorkspaceArchive(payload),
    options: {
      ...(payload.options || {}),
      cloudBuildId: undefined,
    },
  };
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

export async function runFactoryWorker(payload, { dryRun = false } = {}) {
  if (dryRun) {
    const plan = buildStageExecutionPlan(payload);
    const shouldEnqueue = Boolean(plan.nextStage && stageIsAtOrBefore(plan.nextStage, payload.targetStage));
    return {
      status: "planned",
      stage: payload.stage,
      owner: plan.owner,
      commands: plan.commands,
      nextStage: plan.nextStage,
      enqueueNext: shouldEnqueue,
    };
  }

  const sink = logSink(payload);
  const shouldRestoreWorkspace = !(RELEASE_STAGES.has(payload.stage) && payload.options?.cloudBuildId);
  const restore = shouldRestoreWorkspace ? await restoreWorkspaceArchive(payload) : { skipped: true };
  if (restore.ok === false) {
    // Workspace archive restore failed — deterministic (bad/missing archive), so
    // ack rather than loop. retryable:false drives the non-retry HTTP ack.
    const message = `workspace archive restore failed: ${restore.error}`;
    const failed = applyFailureDiagnosis({ status: "failed", stage: payload.stage, owner: "cloud_run_service", outputs: [], nextStage: null, error: message, retryable: false }, { stage: payload.stage, message });
    logStage("ERROR", { runId: payload.runId, itemId: payload.itemId, stage: payload.stage, attempt: payload.attempt, retryable: false, message: `stage failed: ${message}` });
    await recordStageEvent(payload, { type: STAGE_ERROR_TYPE, status: "failed", owner: failed.owner, error: message, classification: failed.classification, firstError: failed.firstError, fixHint: failed.fixHint, retryable: failed.retryable, data: stageErrorFrameData({ message, attempt: payload.attempt }) });
    await persistArtifacts(payload, failed);
    await sink.close();
    return failed;
  }
  const plan = buildStageExecutionPlan(payload);
  await recordStageEvent(payload, { type: "stage_started", status: "running", owner: plan.owner, nextStage: plan.nextStage });
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
    // The eval-judge model for the generated eval_config.yaml. commandEnv already
    // inherits process.env.GE_JUDGE_MODEL via the spread above; a per-run
    // payload.options.judgeModel (operator .ge.json → submit) overrides it.
    ...(payload.options?.judgeModel ? { GE_JUDGE_MODEL: String(payload.options.judgeModel) } : {}),
    ...(payload.options?.evalJudgeSamples ? { GE_EVAL_JUDGE_SAMPLES: String(payload.options.evalJudgeSamples) } : {}),
    ...(payload.options?.maxOutputTokens != null
      ? { GE_AGENT_MAX_OUTPUT_TOKENS: String(payload.options.maxOutputTokens) }
      : {}),
  };
  const meta = { runId: payload.runId, agentId: payload.workspaceId || payload.itemId, stage: payload.stage };
  // Mirror streamed command output into the ledger as live `stage_log` frames (remote).
  const isCloudBuildPoll = RELEASE_STAGES.has(payload.stage) && Boolean(payload.options?.cloudBuildId);
  // Cloud Build poll commands return a giant JSON describe payload. Do not stream
  // that into the live tail; the poll branch below mirrors the actual build log
  // with a durable cursor instead.
  const logTap = makeLedgerLogTap(payload, isCloudBuildPoll ? () => {} : sink.log);
  for (const [cmd, args] of plan.commands) {
    const cwd = cmd === "uv" || cmd === "bash" ? payload.workspaceDir : resolve("."); // cwd-coupling-ok: worker WORKDIR is Dockerfile-pinned to the repo root
    const result = await execStream(cmd, args, { cwd, env: commandEnv, onEvent: isCloudBuildPoll ? () => {} : logTap.onEvent, meta });
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
      const diagnosis = classifyStageFailure({ stage: payload.stage, message, outputs, result });
      const retryable = isTransientFailure(message, result) || diagnosis.retryable === true;
      const errorData = {
        ...stageErrorFrameData({
        message,
        stack: String(result.stderr || "").trim() || null,
        cmd: `${cmd} ${Array.isArray(args) ? args.join(" ") : ""}`.trim(),
        attempt: payload.attempt,
        }),
        classification: diagnosis.classification,
        firstError: diagnosis.firstError,
        fixHint: diagnosis.fixHint,
        retryable,
      };
      const failed = { status: "failed", stage: payload.stage, owner: plan.owner, outputs, nextStage: null, error: message, retryable, classification: diagnosis.classification, firstError: diagnosis.firstError, fixHint: diagnosis.fixHint };
      await logTap.stop();
      // Single structured line so the failure is NEVER an empty ERROR log again.
      logStage("ERROR", { runId: payload.runId, itemId: payload.itemId, stage: payload.stage, attempt: payload.attempt, retryable, classification: failed.classification, firstError: failed.firstError, message: `stage failed: ${message}` });
      sink.log(makeEvent({ ...meta, type: STAGE_ERROR_TYPE, level: "error", data: { owner: plan.owner, error: message, ...errorData } }));
      // stage_error frame carries message + stack + cmd + attempt; mapped to the
      // existing "failed" status so the reducer/StatusChip + Firestore summary render it.
      await recordStageEvent(payload, { type: STAGE_ERROR_TYPE, status: "failed", owner: plan.owner, error: message, classification: failed.classification, firstError: failed.firstError, fixHint: failed.fixHint, retryable, data: errorData });
      await persistArtifacts(payload, failed);
      await sink.close();
      return failed;
    }
  }
  await logTap.stop();
  if (RELEASE_STAGES.has(payload.stage)) {
    if (payload.options?.cloudBuildId) {
      const build = parseCloudBuildDescribe(outputs.at(-1)?.stdout || "{}");
      const mirrored = await mirrorCloudBuildLogs(payload, payload.options.cloudBuildId).catch((error) => ({
        ok: false,
        offset: Number(payload.options?.cloudBuildLogOffset || 0),
        mirroredLines: 0,
        progressEvents: 0,
        error: error?.message || String(error),
      }));
      if (!CLOUD_BUILD_TERMINAL_SUCCESS.has(build.status)) {
        if (CLOUD_BUILD_TERMINAL_FAILURE.has(build.status)) {
          const stageArtifact = await readStageResultArtifact(payload, payload.stage);
          const artifactFailure = stageArtifact?.result && typeof stageArtifact.result === "object"
            ? stageArtifact.result
            : null;
          const baseError = artifactFailure?.error
            || build.failureInfo?.detail
            || `Cloud Build ${build.status}${build.logUrl ? ` (${build.logUrl})` : ""}`;
          const diagnosis = classifyStageFailure({
            stage: payload.stage,
            error: [
              baseError,
              artifactFailure?.firstError,
              artifactFailure?.classification,
              artifactFailure?.fixHint,
              build.failureInfo?.detail,
              build.failedStep ? `failed step ${build.failedStep.id || "<unknown>"} ${build.failedStep.name || ""} exit ${build.failedStep.exitCode ?? ""}` : "",
            ].filter(Boolean).join("\n"),
          });
          const failed = {
            ...(artifactFailure || {}),
            status: "failed",
            stage: payload.stage,
            owner: plan.owner,
            operation: payload.options.cloudBuildId,
            outputs,
            nextStage: null,
            error: baseError,
            logUrl: build.logUrl,
            buildStatus: build.status,
            failureInfo: build.failureInfo,
            failedStep: build.failedStep,
            stageResultUri: stageArtifact?.uri || null,
            cloudBuildLogOffset: mirrored.offset,
            cloudBuildLogSource: mirrored.source || null,
            cloudBuildLogError: mirrored.error || null,
            classification: artifactFailure?.classification || diagnosis.classification,
            firstError: artifactFailure?.firstError || diagnosis.firstError,
            fixHint: artifactFailure?.fixHint || diagnosis.fixHint,
            // Terminal Cloud Build outcome — deterministic, ack to stop the loop.
            retryable: false,
          };
          sink.log(makeEvent({ ...meta, type: "stage_failed", level: "error", data: { owner: plan.owner, error: failed.error, classification: failed.classification, firstError: failed.firstError, fixHint: failed.fixHint, logUrl: failed.logUrl, stageResultUri: failed.stageResultUri } }));
          await recordStageEvent(payload, {
            type: "stage_failed",
            status: "failed",
            owner: plan.owner,
            operation: payload.options.cloudBuildId,
            error: failed.error,
            classification: failed.classification,
            firstError: failed.firstError,
            fixHint: failed.fixHint,
            retryable: false,
            data: {
              classification: failed.classification,
              firstError: failed.firstError,
              fixHint: failed.fixHint,
              logUrl: failed.logUrl,
              stageResultUri: failed.stageResultUri,
              cloudBuildLogOffset: failed.cloudBuildLogOffset,
              cloudBuildLogSource: failed.cloudBuildLogSource,
              cloudBuildLogError: failed.cloudBuildLogError,
              failureInfo: failed.failureInfo,
              failedStep: failed.failedStep,
            },
          });
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
          cloudBuildLogOffset: mirrored.offset,
          mirroredLogLines: mirrored.mirroredLines,
          mirroredProgressEvents: mirrored.progressEvents,
          cloudBuildLogSource: mirrored.source || null,
          cloudBuildLogError: mirrored.error || null,
        };
        await recordStageEvent(payload, {
          type: "stage_waiting",
          status: "waiting",
          owner: plan.owner,
          operation: payload.options.cloudBuildId,
          nextStage: payload.stage,
          data: {
            cloudBuildLogOffset: waiting.cloudBuildLogOffset,
            mirroredLogLines: waiting.mirroredLogLines,
            mirroredProgressEvents: waiting.mirroredProgressEvents,
            cloudBuildLogSource: waiting.cloudBuildLogSource,
            cloudBuildLogError: waiting.cloudBuildLogError,
          },
        });
        await persistArtifacts(payload, waiting, { artifactName: cloudBuildPollArtifactName(payload.stage) });
        const queued = await enqueueFactoryStage(buildCloudBuildPollPayload(payload, payload.options.cloudBuildId, { cloudBuildLogOffset: mirrored.offset }), { scheduleTime: "+30s" });
        waiting.queuedNext = queued;
        await sink.close();
        return waiting;
      }
      const canonicalValidation = await materializeCanonicalValidateArtifacts(payload);
      if (canonicalValidation.ok === false) {
        const failed = {
          status: "failed",
          stage: payload.stage,
          owner: plan.owner,
          operation: payload.options.cloudBuildId,
          outputs,
          nextStage: null,
          error: canonicalValidation.error,
          logUrl: build.logUrl,
          buildStatus: build.status,
          cloudBuildLogOffset: mirrored.offset,
          mirroredLogLines: mirrored.mirroredLines,
          mirroredProgressEvents: mirrored.progressEvents,
          cloudBuildLogSource: mirrored.source || null,
          cloudBuildLogError: mirrored.error || null,
          classification: "workspace_validation",
          firstError: canonicalValidation.error,
          fixHint: "Inspect artifacts/validation-report.json and artifacts/spec-code-trace.json; the canonical workspace validation gate must pass before release stages can continue.",
          retryable: false,
          postValidate: canonicalValidation,
        };
        sink.log(makeEvent({ ...meta, type: "stage_failed", level: "error", data: { owner: plan.owner, error: failed.error, classification: failed.classification, firstError: failed.firstError, fixHint: failed.fixHint, logUrl: failed.logUrl } }));
        await recordStageEvent(payload, {
          type: "stage_failed",
          status: "failed",
          owner: plan.owner,
          operation: payload.options.cloudBuildId,
          error: failed.error,
          classification: failed.classification,
          firstError: failed.firstError,
          fixHint: failed.fixHint,
          retryable: false,
          data: {
            classification: failed.classification,
            firstError: failed.firstError,
            fixHint: failed.fixHint,
            logUrl: failed.logUrl,
            cloudBuildLogOffset: failed.cloudBuildLogOffset,
            cloudBuildLogSource: failed.cloudBuildLogSource,
            cloudBuildLogError: failed.cloudBuildLogError,
            postValidate: canonicalValidation,
          },
        });
        await persistArtifacts(payload, failed);
        await sink.close();
        return failed;
      }
      const nextStage = plan.nextStage && stageIsAtOrBefore(plan.nextStage, payload.targetStage) ? plan.nextStage : null;
      const done = { status: "done", stage: payload.stage, owner: plan.owner, operation: payload.options.cloudBuildId, buildStatus: build.status, outputs, nextStage, logUrl: build.logUrl, cloudBuildLogOffset: mirrored.offset, mirroredLogLines: mirrored.mirroredLines, mirroredProgressEvents: mirrored.progressEvents, cloudBuildLogSource: mirrored.source || null, cloudBuildLogError: mirrored.error || null, postValidate: canonicalValidation.skipped ? null : canonicalValidation };
      sink.log(makeEvent({ ...meta, type: "stage_done", level: "info", data: { owner: plan.owner, nextStage } }));
      await recordStageEvent(payload, {
        type: "stage_done",
        status: "done",
        owner: plan.owner,
        operation: payload.options.cloudBuildId,
        nextStage,
        data: {
          cloudBuildLogOffset: done.cloudBuildLogOffset,
          mirroredLogLines: done.mirroredLogLines,
          mirroredProgressEvents: done.mirroredProgressEvents,
          cloudBuildLogSource: done.cloudBuildLogSource,
          cloudBuildLogError: done.cloudBuildLogError,
        },
      });
      await persistArtifacts(payload, done);
      if (nextStage) {
        const queued = await enqueueFactoryStage(buildAdvancedPayload(payload, nextStage), {
          scheduleTime: payload.stage === "deploy_runtime" ? "+120s" : null,
        });
        done.queuedNext = queued;
        await recordStageEvent(payload, {
          type: queued.ok ? "stage_next_queued" : "stage_next_queue_failed",
          status: queued.ok ? "queued" : "blocked",
          owner: "cloud_tasks",
          nextStage,
          error: queued.ok ? null : queued.stderr || "failed to enqueue next stage",
        });
      }
      await sink.close();
      return done;
    }

    const cloudBuildId = parseCloudBuildId(`${outputs.at(-1)?.stdout || ""}\n${outputs.at(-1)?.stderr || ""}`);
    if (!cloudBuildId) {
      const failed = applyFailureDiagnosis({ status: "failed", stage: payload.stage, owner: plan.owner, outputs, nextStage: null, error: "Cloud Build submitted but build id was not found", retryable: false }, { stage: payload.stage, outputs });
      sink.log(makeEvent({ ...meta, type: "stage_failed", level: "error", data: { owner: plan.owner, error: failed.error, classification: failed.classification, firstError: failed.firstError, fixHint: failed.fixHint } }));
      await recordStageEvent(payload, { type: "stage_failed", status: "failed", owner: plan.owner, error: failed.error, classification: failed.classification, firstError: failed.firstError, fixHint: failed.fixHint, retryable: false });
      await persistArtifacts(payload, failed);
      await sink.close();
      return failed;
    }
    const submitted = { status: "submitted", stage: payload.stage, owner: plan.owner, operation: cloudBuildId, outputs, nextStage: payload.stage };
    await recordStageEvent(payload, { type: "stage_submitted", status: "submitted", owner: plan.owner, operation: cloudBuildId, nextStage: payload.stage });
    await persistArtifacts(payload, submitted, { artifactName: cloudBuildSubmissionArtifactName(payload.stage) });
    const queued = await enqueueFactoryStage(buildCloudBuildPollPayload(payload, cloudBuildId), { scheduleTime: "+30s" });
    submitted.queuedNext = queued;
    await sink.close();
    return submitted;
  }

  const nextStage = plan.nextStage && stageIsAtOrBefore(plan.nextStage, payload.targetStage) ? plan.nextStage : null;
  const done = { status: "done", stage: payload.stage, owner: plan.owner, outputs, nextStage };
  sink.log(makeEvent({ ...meta, type: "stage_done", level: "info", data: { owner: plan.owner, nextStage } }));
  await recordStageEvent(payload, { type: "stage_done", status: "done", owner: plan.owner, nextStage });
  const persisted = await persistArtifactsOrFail(payload, done);
  if (!persisted.ok) {
    const failed = persisted.failed;
    sink.log(makeEvent({ ...meta, type: "stage_failed", level: "error", data: { owner: plan.owner, error: failed.error, classification: failed.classification, firstError: failed.firstError, fixHint: failed.fixHint } }));
    await recordStageEvent(payload, { type: "stage_failed", status: "failed", owner: plan.owner, error: failed.error, classification: failed.classification, firstError: failed.firstError, fixHint: failed.fixHint, retryable: false });
    await sink.close();
    return failed;
  }
  if (nextStage) {
    const nextPayload = buildNextPayload(payload, nextStage);
    const queued = await enqueueFactoryStage(nextPayload, {
      scheduleTime: payload.stage === "deploy_runtime" ? "+120s" : null,
    });
    done.queuedNext = queued;
    await recordStageEvent(payload, {
      type: queued.ok ? "stage_next_queued" : "stage_next_queue_failed",
      status: queued.ok ? "queued" : "blocked",
      owner: "cloud_tasks",
      nextStage,
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
