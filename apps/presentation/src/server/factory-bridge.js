import { spawn } from "node:child_process";
import { parseList } from "@ge/std/list";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { join, dirname, resolve } from "node:path";
import { readJson as baseReadJson, writeJson } from "@ge/std/json-io";
import { resolveGcpProject } from "@ge/std/gcp-config";
import dotenv from "dotenv";

// Resolve presentation root and load local env parameters
const PRESENTATION_ROOT = resolve(import.meta.dirname, "../..");
dotenv.config({ path: join(PRESENTATION_ROOT, ".env") });

const IS_PROD = process.env.NODE_ENV === "production" || !!process.env.K_SERVICE;
const CONTROL_PLANE_PROJECT = resolveGcpProject() || "";
const CONTROL_PLANE_BUCKET = process.env.GE_AGENT_FACTORY_BUCKET || (CONTROL_PLANE_PROJECT ? `${CONTROL_PLANE_PROJECT}-ge-agent-factory` : "");

// Worker URL is required only to DISPATCH a provisioning run — validated in
// submitFactoryRun at the point of use, NOT at module load. vite.config imports
// this file at BUILD time (where the runtime env is absent), and per-agent
// provisioning is disabled by default, so an import-time throw needlessly broke
// the build.
const WORKER_URL = process.env.GE_AGENT_FACTORY_WORKER_URL || "";

const HARNESS_ROOT = resolve(import.meta.dirname, "../../../factory");
const BRIDGE_STATE_PATH = resolve(import.meta.dirname, "../../../../.factory-runs.json");

// Helper: slug name
function slug(value, max = 48) {
  const normalized = String(value || "agent-workspace")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return (normalized || "agent-workspace").slice(0, max).replace(/-+$/g, "") || "agent-workspace";
}

// Helper: pascal name
function pascal(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

// Helper: humanize a machine id into a user-facing Title Case label.
// Mirrors titleCase() in @ge/std/naming
// (kept local to avoid a cross-app import). "account_reconciliation_agent" →
// "Account Reconciliation Agent". Used only for the GE display name id fallback.
export function humanize(value) {
  return String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

// Stages that publish to / depend on the live Gemini Enterprise app. A run whose
// target reaches any of these MUST resolve a Gemini Enterprise app id up front.
const APP_ID_REQUIRED_STAGES = new Set(["publish_enterprise", "verify_live"]);

// Helper: derive a domain-neutral, capability-driven description from the spec.
// Avoids the old "hr" default leaking a wrong domain into the live GE tool
// description. Prefers the spec's own domain/systems/workflows/title; falls back
// to a generic, non-domain-specific phrase only when no signal exists.
export function deriveToolDescription({ generationSpec, title, useCaseId, systems, domain }) {
  if (generationSpec && generationSpec.description) return String(generationSpec.description);

  const specDomain = generationSpec && (generationSpec.domain || generationSpec.department);
  const effectiveDomain = (specDomain && String(specDomain).trim()) || (domain && String(domain).trim());

  const systemsList = systems
    ? systems
    : Array.isArray(generationSpec && generationSpec.systems)
      ? generationSpec.systems
          .map((s) => (typeof s === "string" ? s : s && (s.name || s.id)))
          .filter(Boolean)
          .join(",")
      : "";
  const across = systemsList ? ` across ${systemsList}` : "";

  if (effectiveDomain) {
    return `Use this agent for ${humanize(effectiveDomain).toLowerCase()} workflows${across}.`;
  }
  const label = (generationSpec && (generationSpec.displayName || generationSpec.title)) || humanize(useCaseId || title);
  return `Use this agent for ${label} tasks${across}.`;
}

export function defaultFactoryStartStage({ prebuiltArchive = null, refine = true } = {}) {
  if (prebuiltArchive) return "load_data";
  return refine === false ? "validate" : "harness_refine";
}

// Helper: Parse GCS URI bucket and path
export function parseGsUri(gsUri) {
  const match = String(gsUri || "").match(/^gs:\/\/([^/]+)\/(.+)$/);
  if (!match) throw new Error(`Invalid GCS URI: ${gsUri}`);
  return { bucket: match[1], object: match[2] };
}

// Thin wrapper over @ge/std/json-io.readJson preserving this module's {}-on-miss default.
const readJson = (path) => baseReadJson(path, {});

// Helper: read canonical local factory config
function readHarnessEnv() {
  const geConfig = readJson(resolve(HARNESS_ROOT, "..", "..", ".ge.json"));
  const envPath = resolve(HARNESS_ROOT, "..", "..", ".ge", "factory", ".env");
  const env = {
    GOOGLE_CLOUD_PROJECT: geConfig.project || "",
    GOOGLE_CLOUD_PROJECT_NUMBER: geConfig.projectNumber || "",
    GE_AGENT_RUNTIME_REGION: geConfig.region || geConfig.geLocation || "",
    GE_AGENT_FACTORY_BUCKET: geConfig.bucket || "",
  };
  if (!existsSync(envPath)) return Object.fromEntries(Object.entries(env).filter(([, value]) => value));
  return {
    ...Object.fromEntries(Object.entries(env).filter(([, value]) => value)),
    ...Object.fromEntries(
    readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const idx = line.indexOf("=");
        return [line.slice(0, idx), line.slice(idx + 1).replace(/^['"]|['"]$/g, "")];
      })
    ),
  };
}

// Helper: run a child process to completion WITHOUT blocking the event loop,
// preserving execFileSync's throw-on-nonzero-exit contract (and, when the caller
// passes stdio:"inherit", its live log streaming). Replaces the former
// execFileSync calls in submitFactoryRun's prod path so a full generator +
// tar run no longer stalls the whole Node process for every submit request.
function runToCompletion(command, args, options = {}) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, options);
    child.on("error", rejectRun);
    child.on("close", (code) => {
      if (code === 0) resolveRun();
      else rejectRun(new Error(`${command} exited with code ${code}`));
    });
  });
}

// Helper: run node child process in local mode
function runNode(args, env) {
  return new Promise((resolveRun) => {
    const child = spawn("node", args, {
      cwd: HARNESS_ROOT,
      env: { ...process.env, ...env },
      stdio: "pipe",
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", (error) => resolveRun({ code: 1, stdout, stderr: error.message }));
    child.on("close", (code) => resolveRun({ code: code ?? 1, stdout, stderr }));
  });
}

// Helper: parse last JSON packet from CLI output
function parseLastJson(text) {
  const raw = String(text || "");
  for (let i = raw.lastIndexOf("{"); i >= 0; i = raw.lastIndexOf("{", i - 1)) {
    try {
      return JSON.parse(raw.slice(i));
    } catch { /* best-effort: scanning backwards for the last parseable JSON packet; non-JSON tails are expected */ }
  }
  return null;
}

// Helper: local state persistence
function readBridgeState() {
  try {
    return JSON.parse(readFileSync(BRIDGE_STATE_PATH, "utf8"));
  } catch {
    return { runs: [] };
  }
}

function writeBridgeState(state) {
  writeJson(BRIDGE_STATE_PATH, state);
}

// Helper: GCP metadata access token fetcher
async function getAccessToken() {
  if (IS_PROD) {
    try {
      const res = await fetch("http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token", {
        headers: { "Metadata-Flavor": "Google" }
      });
      if (res.ok) {
        const data = await res.json();
        return data.access_token;
      }
    } catch (err) {
      console.error("Metadata server access token request failed:", err.message);
    }
  }
  return new Promise((resolve) => {
    const child = spawn("gcloud", ["auth", "print-access-token"]);
    let out = "";
    child.stdout.on("data", d => out += d);
    child.on("close", (code) => resolve(code === 0 ? out.trim() : null));
  });
}

// Helper: HTTP GET call to GCS REST API
async function readGcsFile(bucket, object, token) {
  const url = `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(object)}?alt=media`;
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch GCS file ${object}: ${res.statusText}`);
  return res.json();
}

// Helper: HTTP POST call to GCS media upload API
async function writeGcsFile(bucket, object, data, token) {
  const url = `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(bucket)}/o?uploadType=media&name=${encodeURIComponent(object)}`;
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: data
  });
  if (!res.ok) throw new Error(`Failed to write GCS file ${object}: ${res.statusText}`);
  return res.json();
}

// Helper: Run node subcommand to read GCS file in Local Mode
async function readStageLocal(gsPath, harnessEnv) {
  return new Promise((resolve) => {
    const child = spawn("gcloud", ["storage", "cat", gsPath], {
      env: { ...process.env, ...harnessEnv }
    });
    let out = "";
    child.stdout.on("data", d => out += d);
    child.on("close", (code) => {
      if (code === 0 && out.trim()) {
        try { resolve(JSON.parse(out)); } catch { resolve(null); }
      } else {
        resolve(null);
      }
    });
  });
}

// Helper: format values for Firestore Rest API
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

// Helper: Patch Firestore document natively via REST
async function patchFirestoreDocument({ projectId, path, data, token }) {
  if (!projectId || !token) return;
  const fields = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, firestoreValue(v)]));
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const masks = Object.keys(fields).map((field) => `updateMask.fieldPaths=${encodeURIComponent(field)}`).join("&");
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${encodedPath}?${masks}`;
  
  const res = await fetch(url, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    throw new Error(`Failed to patch Firestore document: ${res.status} - ${await res.text()}`);
  }
}

// Helper: Enqueue first stage using native Cloud Tasks REST API
async function enqueueCloudTask(controlPlaneProject, region, queue, workerUrl, serviceAccount, payload, accessToken) {
  const parent = `projects/${controlPlaneProject}/locations/${region}/queues/${queue}`;
  const taskId = `task-${payload.runId}-${payload.itemId}-${payload.stage}-${payload.attempt}`;
  const taskName = `${parent}/tasks/${taskId}`;
  const url = `https://cloudtasks.googleapis.com/v2/${parent}/tasks`;
  
  const taskPayload = {
    task: {
      name: taskName,
      // Timeout triangle (taste-campaign 09 §C1): match the worker's Cloud Run
      // timeout (installer/terraform/cloud_run.tf: timeout = "1800s"; also the
      // Cloud Tasks maximum) so a stage running past the 600s Cloud Tasks default
      // is never redelivered concurrently while attempt 1 still executes. Keep in
      // lockstep with TASK_DISPATCH_DEADLINE in apps/factory/src/factory-worker.js —
      // factory-worker-timeouts.test.mjs asserts this file carries the same value.
      dispatchDeadline: "1800s",
      httpRequest: {
        httpMethod: "POST",
        url: workerUrl,
        headers: { "Content-Type": "application/json" },
        body: Buffer.from(JSON.stringify(payload)).toString("base64"),
        oidcToken: {
          serviceAccountEmail: serviceAccount,
          audience: workerUrl
        }
      }
    }
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(taskPayload)
  });
  
  const text = res.ok ? "" : await res.text();
  const duplicate = res.status === 409 || /ALREADY_EXISTS|already exists/i.test(text);
  if (!res.ok && !duplicate) {
    throw new Error(`Failed to create Cloud Task: ${res.status} - ${text}`);
  }
  return { ok: true, duplicate };
}

/**
 * Fetch list of Gemini Enterprise agents/apps natively via Discovery Engine REST API
 */
export async function listAgents({ projectId, location }) {
  const targetProject = projectId || CONTROL_PLANE_PROJECT;
  const targetLocation = location || "global";

  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error("Authorization token is unavailable.");
    }

    const host = targetLocation === "global" ? "discoveryengine.googleapis.com" : `${targetLocation}-discoveryengine.googleapis.com`;
    const url = `https://${host}/v1alpha/projects/${targetProject}/locations/${targetLocation}/collections/default_collection/engines`;
    
    const res = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Discovery Engine API returned HTTP ${res.status}: ${text}`);
    }
    
    const data = await res.json();
    const agents = (data.engines || []).map(engine => ({
      id: engine.name,
      displayName: engine.displayName
    }));
    
    return { ok: true, agents };
  } catch (err) {
    return { ok: false, error: err.message, agents: [] };
  }
}

/**
 * 1. Preflight Target Verification — runs every check, returns structured results.
 *    Shape: { ok, message, checks: [{id, label, status: "pass"|"fail"|"skipped", detail}] }
 */
export async function preflightTarget(target = {}) {
  const targetProject = target.projectId || CONTROL_PLANE_PROJECT;
  const targetBucket = target.artifactBucket || (targetProject ? `${targetProject}-ge-agent-factory` : "");
  const appId = target.geminiEnterpriseAppId;
  const region = target.runtimeRegion || "us-central1";
  const checks = [];
  const push = (id, label, status, detail) => checks.push({ id, label, status, detail });

  if (!targetProject) {
    push("project_id", "Target project id supplied", "fail", "No projectId on request and GOOGLE_CLOUD_PROJECT is not set on the gateway.");
    return summarize(checks);
  }
  push("project_id", "Target project id supplied", "pass", targetProject);

  let token;
  try {
    token = await getAccessToken();
  } catch (err) {
    push("auth_token", "GCP access token reachable", "fail", err.message);
    return summarize(checks);
  }
  if (!token) {
    push("auth_token", "GCP access token reachable", "fail", "No access token from metadata server or gcloud.");
    return summarize(checks);
  }
  push("auth_token", "GCP access token reachable", "pass", "Token acquired");

  await runCheck(checks, "project_access", "Project visible to caller", async () => {
    const res = await fetch(`https://cloudresourcemanager.googleapis.com/v1/projects/${targetProject}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} from cloudresourcemanager`);
    return `Project "${targetProject}" reachable`;
  });

  const allowed = process.env.GE_ALLOWED_PROJECTS;
  if (allowed) {
    const projects = parseList(allowed);
    if (projects.includes(targetProject)) {
      push("allowlist", "Project allowlist", "pass", `"${targetProject}" is in GE_ALLOWED_PROJECTS`);
    } else {
      push("allowlist", "Project allowlist", "fail", `"${targetProject}" is not in GE_ALLOWED_PROJECTS (${projects.join(", ")})`);
    }
  } else {
    push("allowlist", "Project allowlist", "skipped", "GE_ALLOWED_PROJECTS not set");
  }

  const requiredApis = [
    "storage.googleapis.com",
    "aiplatform.googleapis.com",
    "discoveryengine.googleapis.com",
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "firestore.googleapis.com",
    "cloudtasks.googleapis.com",
    "iam.googleapis.com",
    "serviceusage.googleapis.com",
    "secretmanager.googleapis.com",
  ];
  await runCheck(checks, "required_apis", "Required APIs enabled", async () => {
    const res = await fetch(`https://serviceusage.googleapis.com/v1/projects/${targetProject}/services?filter=state:ENABLED&pageSize=200`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} from serviceusage`);
    const data = await res.json();
    const enabledApis = new Set((data.services || []).map(s => s.config?.name));
    const missing = requiredApis.filter(api => !enabledApis.has(api));
    if (missing.length) throw new Error(`Missing: ${missing.join(", ")}`);
    return `All ${requiredApis.length} APIs enabled`;
  });

  await runCheck(checks, "bucket_access", "Factory artifact bucket reachable", async () => {
    if (!targetBucket) throw new Error("No bucket name resolved");
    const res = await fetch(`https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(targetBucket)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching gs://${targetBucket}`);
    return `gs://${targetBucket} reachable`;
  });

  const runnerSa = target.serviceAccount || `ge-agent-factory-runner@${targetProject}.iam.gserviceaccount.com`;
  await runCheck(checks, "service_account", "Factory runner service account exists", async () => {
    const res = await fetch(`https://iam.googleapis.com/v1/projects/${targetProject}/serviceAccounts/${runnerSa}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${runnerSa}`);
    return runnerSa;
  });

  if (appId) {
    const appPattern = /^projects\/([^/]+)\/locations\/([^/]+)\/(agents|collections\/[^/]+\/engines)\/([^/]+)$/;
    const match = appId.match(appPattern);
    if (!match) {
      push("gemini_enterprise_app", "Gemini Enterprise app id valid", "fail",
        "Must be projects/[PROJECT]/locations/[LOCATION]/(agents|collections/.../engines)/[ID]");
    } else {
      const appLocation = match[2];
      if (appLocation !== "global" && appLocation !== region) {
        push("gemini_enterprise_app", "Gemini Enterprise app id valid", "fail",
          `App location "${appLocation}" doesn't match target region "${region}" (use "global" or align regions)`);
      } else {
        push("gemini_enterprise_app", "Gemini Enterprise app id valid", "pass", appId);
      }
    }
  } else if (APP_ID_REQUIRED_STAGES.has(String(target.targetStage || ""))) {
    // The target reaches publish_enterprise (or beyond) but no app id was supplied —
    // this is a hard failure, not a skip: the publish stage cannot run without it.
    push("gemini_enterprise_app", "Gemini Enterprise app id valid", "fail",
      `Target stage "${target.targetStage}" requires a Gemini Enterprise app id, but none was provided.`);
  } else {
    push("gemini_enterprise_app", "Gemini Enterprise app id valid", "skipped", "No appId provided");
  }

  return summarize(checks);
}

async function runCheck(checks, id, label, fn) {
  try {
    const detail = await fn();
    checks.push({ id, label, status: "pass", detail: detail || "ok" });
  } catch (err) {
    checks.push({ id, label, status: "fail", detail: err.message });
  }
}

function summarize(checks) {
  const failed = checks.filter(c => c.status === "fail");
  const ok = failed.length === 0;
  const message = ok
    ? `All ${checks.length} preflight checks passed.`
    : `${failed.length} of ${checks.length} preflight checks failed: ${failed.map(c => c.id).join(", ")}`;
  return { ok, message, checks };
}

/**
 * 2. Submit Factory Run (Ordered Queued-First Flow + Perfect Scaffolding Parity)
 */
export async function submitFactoryRun(request) {
  const title = String(request.title || request.useCaseId || "Agent Workspace");
  const useCaseId = String(request.useCaseId || pascal(title));
  const workspaceId = slug(request.workspace || title);
  const targetStage = String(request.targetStage || "publish_enterprise");
  const rows = String(request.rows || "48");
  const systems = Array.isArray(request.systems) ? request.systems.join(",") : String(request.systems || "");
  const generationSpec = request.generationSpec && typeof request.generationSpec === "object" ? request.generationSpec : null;
  // Resolve the domain WITHOUT silently defaulting to "hr": prefer the request,
  // then the spec, otherwise leave it empty so the tool/agent description can be
  // domain-neutral (a finance agent must never be described as "hr"). The CLI
  // generator's --domain arg still needs a slug, so it gets a neutral fallback
  // below at the point of use (not baked into the description path).
  const domainSource =
    request.department ||
    request.domain ||
    (generationSpec && (generationSpec.domain || generationSpec.department)) ||
    "";
  const domain = String(domainSource).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  // User-facing GE display name. Prefer an explicit title or spec displayName as-is;
  // only the machine-id fallback (useCaseId, e.g. "account_reconciliation_agent")
  // is humanized to Title Case ("Account Reconciliation Agent").
  const displayName = request.title
    ? String(request.title)
    : (generationSpec && generationSpec.displayName)
      ? String(generationSpec.displayName)
      : humanize(title);

  const runId = "run-" + crypto.randomUUID().slice(0, 8) + "-" + Date.now().toString().slice(-4);
  const target = request.target || {};
  const targetProject = target.projectId || CONTROL_PLANE_PROJECT;
  const targetRegion = target.runtimeRegion || "us-central1";
  const targetBucket = target.artifactBucket || `${targetProject}-ge-agent-factory`;

  // Fail fast: a run whose target reaches publish_enterprise (or beyond) MUST have
  // a resolvable Gemini Enterprise app id. Without this guard the run is admitted,
  // scaffolds, deploys, and only errors at the very end of the pipeline. Runs that
  // don't target publish are unaffected (the app id stays optional / "skipped").
  // In local mode the app id can also come from the harness .env, so consult both.
  const resolvableAppId =
    target.geminiEnterpriseAppId || (!IS_PROD && readHarnessEnv().GEMINI_ENTERPRISE_APP_ID) || "";
  if (APP_ID_REQUIRED_STAGES.has(targetStage) && !resolvableAppId) {
    throw new Error(
      `Gemini Enterprise App ID is required to target the "${targetStage}" stage. ` +
        `Set target.geminiEnterpriseAppId (projects/[PROJECT]/locations/[LOCATION]/(agents|collections/.../engines)/[ID]) ` +
        `or choose an earlier target stage.`
    );
  }

  // Standardize full GCS URIs as artifact prefix
  const artifactPrefix = `gs://${targetBucket}/runs/${runId}/items/${workspaceId}`;
  let workspaceArchive = `${artifactPrefix}/workspace.tar.gz`;

  // Handoff (ge handoff): the client already built + uploaded the workspace.
  // Skip regeneration, consume the prebuilt archive, and start past the build
  // boundary (default load_data → deploy → register → publish run remotely).
  const prebuiltArchive = request.prebuiltArchive ? String(request.prebuiltArchive) : null;
  const defaultStartStage = defaultFactoryStartStage({ prebuiltArchive, refine: request.refine });
  const startStage = String(request.startStage || defaultStartStage);
  if (prebuiltArchive) workspaceArchive = prebuiltArchive;

  const agentId = request.usecaseId || null;

  const runRecord = {
    ok: true,
    createdAt: new Date().toISOString(),
    title,
    useCaseId,
    workspaceId,
    targetStage,
    project: targetProject,
    region: targetRegion,
    bucket: targetBucket,
    generationSpec,
    runId,
    artifactPrefix,
    status: "queued",
    agentId
  };

  if (IS_PROD) {
    const token = await getAccessToken();
    if (!token) throw new Error("GCP authorization token is missing.");

    // Step 1: Write initial GCS run index with status "queued" FIRST (resolves polling race condition)
    const { object: indexObject } = parseGsUri(`gs://${CONTROL_PLANE_BUCKET}/runs/${runId}.json`);
    await writeGcsFile(CONTROL_PLANE_BUCKET, indexObject, JSON.stringify(runRecord, null, 2), token);

    // Step 2: Perfect Scaffolding Parity inside Container Temporary Workspace.
    // Skipped for ship handoffs — the client already uploaded the prebuilt workspace.
    if (!prebuiltArchive) {
      // Run the JS CLI generators to output a fully-baked, standard workspace package
      const tempDir = `/tmp/run-${runId}`;
      await mkdir(tempDir, { recursive: true });

      // Execute the local JS generator command to construct a real, fully compiled workspace (pyproject.toml, smoke tests, fixtures)
      const generatorScript = join(HARNESS_ROOT, "scripts/factory.mjs");
      const cmdArgs = [generatorScript, "from-usecase", "--dir", tempDir];
      if (request.useCaseId) {
        cmdArgs.push("--usecase", request.useCaseId);
      } else {
        cmdArgs.push("--freeform", `"${title}"`);
      }
      if (systems) cmdArgs.push("--systems", systems);
      cmdArgs.push("--rows", rows);
      // The generator needs a concrete domain slug; use the resolved domain when
      // present, otherwise a neutral "general" (never the old "hr" default).
      cmdArgs.push("--domain", domain || "general");

      // Pin the generated-agent model (default gemini-3.5-flash via factory's own
      // default) and forward an operator-set output-token budget; factory reads these
      // from env. Unset maxOutputTokens ⇒ omitted from the agent (model default).
      const generateEnv = { ...process.env };
      if (request.model) generateEnv.GE_AGENT_MODEL = String(request.model);
      if (request.judgeModel) generateEnv.GE_JUDGE_MODEL = String(request.judgeModel);
      if (request.maxOutputTokens != null && String(request.maxOutputTokens).trim() !== "") {
        generateEnv.GE_AGENT_MAX_OUTPUT_TOKENS = String(request.maxOutputTokens);
      }
      try {
        // spawn (no shell): each arg is a discrete argv entry, so values like
        // --systems "<comma list>" can't be word-split or shell-interpreted.
        // Async (runToCompletion) so the generator run no longer blocks the loop;
        // stdio:"inherit" keeps generator logs streaming to the container.
        await runToCompletion("bun", cmdArgs, { stdio: "inherit", cwd: HARNESS_ROOT, env: generateEnv });
      } catch (err) {
        throw new Error(`Stateless workspace scaffolding failed: ${err.message}`);
      }

      // Compress the fully-baked workspace structure (preserving folders)
      const tarPath = `/tmp/workspace-${runId}.tar.gz`;
      await runToCompletion("tar", ["-czf", tarPath, "-C", tempDir, "."]);

      // Upload archive to GCS target bucket
      const { object: archiveObject } = parseGsUri(workspaceArchive);
      const tarBuffer = await readFile(tarPath);
      await writeGcsFile(targetBucket, archiveObject, tarBuffer, token);
    }

    // Step 3: Record queued states inside Firestore target project
    const now = new Date().toISOString();
    await patchFirestoreDocument({
      projectId: targetProject,
      path: `factoryRuns/${runId}`,
      data: { status: "queued", createdAt: now, updatedAt: now, targetStage, source: "ge-presentation-bridge", workspaceId },
      token
    });
    await patchFirestoreDocument({
      projectId: targetProject,
      path: `factoryRuns/${runId}/items/${workspaceId}`,
      data: { status: "queued", currentStage: startStage, createdAt: now, updatedAt: now, workspaceId, workspaceArchive, artifactPrefix, targetStage, agentId },
      token
    });
    await patchFirestoreDocument({
      projectId: targetProject,
      path: `factoryRuns/${runId}/items/${workspaceId}/stages/${startStage}`,
      data: { status: "queued", createdAt: now, updatedAt: now, attempt: 1, owner: "cloud_tasks", nextStage: null, error: null },
      token
    });

    // Step 4: Enqueue the first stage via Cloud Tasks REST API
    const payload = {
      runId,
      itemId: workspaceId,
      workspaceId,
      stage: startStage,
      attempt: 1,
      targetStage,
      workspaceDir: `/tmp/ge-agent-factory/${runId}/${workspaceId}/workspace`,
      workspaceArchive,
      artifactPrefix,
      workerService: "ge-agent-factory-worker",
      cloud: {
        projectId: targetProject,
        projectNumber: target.projectNumber || "",
        runtimeRegion: targetRegion,
        genaiLocation: target.genaiLocation || "global",
        geminiEnterpriseLocation: target.geminiEnterpriseLocation || "global",
        geminiEnterpriseApp: target.geminiEnterpriseAppId || "",
        pubsubTopic: "ge-agent-factory-events",
        tasksQueue: "ge-agent-factory-stages",
        artifactBucket: targetBucket,
        // Shared agent-data bucket — load_data publishes each agent's mcp-tools.json
        // to gs://<dataBucket>/agents/<id>/mcp-tools.json for the dept MCP service.
        dataBucket: target.dataBucket || (targetProject ? `${targetProject}-ge-agent-data` : ""),
        serviceAccount: target.serviceAccount || `ge-agent-factory-runner@${targetProject}.iam.gserviceaccount.com`,
        // Per-dept custom MCP service URL + agent-identity principalSet. When set, the
        // register_tools stage registers the agent's MCP server and grants iap.egressor.
        mcpServiceUrl: target.mcpServiceUrl || "",
        agentIdentityPrincipalSet: target.agentIdentityPrincipalSet || "",
        // Vertex location for the harness_refine stage's Antigravity run.
        vertexLocation: target.genaiLocation || "global"
      },
      options: {
        targetRuntime: "agent_runtime",
        registerAs: "adk",
        mcpReadOnly: request.mcpReadOnly === true,
        // Antigravity review+refine runs in the cloud factory by default (parity
        // with local builds); the harness_refine stage degrades to deterministic
        // code if Vertex is unavailable. Pass request.refine=false (REFINE=0) to skip.
        refine: request.refine !== false,
        harnessProvider: request.harnessProvider || request.provider || "antigravity-sdk",
        // Pin the generated-agent + harness-review model (default gemini-3.5-flash) and
        // an operator-set output-token budget so the worker stages match local builds.
        ...(request.model ? { model: String(request.model) } : {}),
        ...(request.judgeModel ? { judgeModel: String(request.judgeModel) } : {}),
        ...(request.maxOutputTokens != null && String(request.maxOutputTokens).trim() !== ""
          ? { maxOutputTokens: Number(request.maxOutputTokens) }
          : {}),
        useCaseId,
        freeform: title,
        // Evals are the behavioral gate for these real (mock-data) agents and
        // run by default. The generator now ships an eval_config.json with
        // achievable, reference-free criteria (tool trajectory + rubric quality).
        // Pass request.runAgentEvals=false to skip.
        runAgentEvals: request.runAgentEvals !== false,
        displayName,
        description: (generationSpec && generationSpec.description) || `Specialist agent for ${displayName}.`,
        toolDescription: deriveToolDescription({ generationSpec, title, useCaseId, systems, domain }),
        agentId
      }
    };

    const taskQueue = "ge-agent-factory-stages";
    const controlPlaneRegion = "us-central1";
    if (!WORKER_URL) {
      throw new Error("GE_AGENT_FACTORY_WORKER_URL must be set to dispatch a provisioning run.");
    }
    await enqueueCloudTask(CONTROL_PLANE_PROJECT, controlPlaneRegion, taskQueue, WORKER_URL, payload.cloud.serviceAccount, payload, token);

    // Step 5: Update GCS run index status to "submitted"
    runRecord.status = "submitted";
    await writeGcsFile(CONTROL_PLANE_BUCKET, indexObject, JSON.stringify(runRecord, null, 2), token);
    return runRecord;
  } else {
    // Local Mode Shell fallback path (compatibility-only sandbox execution)
    const harnessEnv = readHarnessEnv();
    const localProject = target.projectId || harnessEnv.GOOGLE_CLOUD_PROJECT || resolveGcpProject();
    const localProjectNum = target.projectNumber || harnessEnv.GOOGLE_CLOUD_PROJECT_NUMBER || process.env.GOOGLE_CLOUD_PROJECT_NUMBER;
    if (!localProject) throw new Error("Local mode requires GOOGLE_CLOUD_PROJECT in env or .ge.json");
    const localRegion = target.runtimeRegion || harnessEnv.GE_AGENT_RUNTIME_REGION || "us-central1";
    const localBucket = target.artifactBucket || harnessEnv.GE_AGENT_FACTORY_BUCKET || `${localProject}-ge-agent-factory`;

    const createArgs = ['src/cli.js', 'create', '--usecase', useCaseId, '--name', workspaceId, '--rows', rows, '--seed', '42', '--domain', domain || 'general'];
    if (systems) createArgs.push('--systems', systems);
    const created = await runNode(createArgs, harnessEnv);
    if (created.code !== 0) throw new Error(`Create failed: ${created.stderr || created.stdout}`);

    const submitArgs = [
      'src/cli.js', 'factory', 'submit',
      '--workspace', workspaceId,
      '--project', localProject,
      '--project-number', localProjectNum,
      '--region', localRegion,
      '--bucket', localBucket,
      '--stage', 'validate',
      '--target', targetStage,
      '--usecase', useCaseId,
    ];
    if (target.geminiEnterpriseAppId || harnessEnv.GEMINI_ENTERPRISE_APP_ID) {
      submitArgs.push('--gemini-enterprise-app-id', target.geminiEnterpriseAppId || harnessEnv.GEMINI_ENTERPRISE_APP_ID);
    }
    if (target.geminiEnterpriseLocation || harnessEnv.GEMINI_ENTERPRISE_LOCATION) {
      submitArgs.push('--gemini-enterprise-location', target.geminiEnterpriseLocation || harnessEnv.GEMINI_ENTERPRISE_LOCATION);
    }

    const submitted = await runNode(submitArgs, harnessEnv);
    if (submitted.code !== 0) throw new Error(`Submit failed: ${submitted.stderr || submitted.stdout}`);

    const submitJson = parseLastJson(submitted.stdout);
    const localRun = {
      ok: true,
      createdAt: new Date().toISOString(),
      title,
      useCaseId,
      workspaceId,
      targetStage,
      project: localProject,
      region: localRegion,
      bucket: localBucket,
      generationSpec,
      ...submitJson,
    };

    const state = readBridgeState();
    state.runs = [localRun, ...(state.runs || []).filter(item => item.runId !== localRun.runId)].slice(0, 50);
    writeBridgeState(state);

    return localRun;
  }
}

/**
 * 3. Run Snapshot Fetcher (Single GCS Run Record Source of Truth)
 */
export async function getFactoryRunSnapshot(runId) {
  if (IS_PROD) {
    const token = await getAccessToken();
    // Use the saved run record first to discover prefix & bucket dynamically (never derive paths client-side)
    const run = await readGcsFile(CONTROL_PLANE_BUCKET, `runs/${runId}.json`, token);
    const stages = ['validate', 'preview', 'plan_deploy', 'load_data', 'deploy_runtime', 'poll_runtime', 'register_tools', 'publish_enterprise', 'verify_live'];
    const artifacts = {};
    const { object: runPrefixObject } = parseGsUri(run.artifactPrefix);
    
    await Promise.all(stages.map(async (stage) => {
      try {
        const gsObject = `${runPrefixObject}/factory-${stage}-result.json`;
        const content = await readGcsFile(run.bucket, gsObject, token);
        artifacts[stage] = content;
      } catch { /* best-effort: a stage that has not run yet has no artifact object in GCS */ }
    }));
    return { ok: true, run, artifacts };
  } else {
    const harnessEnv = readHarnessEnv();
    const state = readBridgeState();
    const run = (state.runs || []).find(item => item.runId === runId);
    if (!run) throw new Error("Run not found.");
    const stages = ['validate', 'preview', 'plan_deploy', 'load_data', 'deploy_runtime', 'poll_runtime', 'register_tools', 'publish_enterprise', 'verify_live'];
    const artifacts = {};
    await Promise.all(stages.map(async (stage) => {
      const gsPath = `${run.artifactPrefix}/factory-${stage}-result.json`;
      const content = await readStageLocal(gsPath, harnessEnv);
      if (content) artifacts[stage] = content;
    }));
    return { ok: true, run, artifacts };
  }
}

/**
 * 4. Run Events Watcher (Server-to-GCS state polling browser-facing SSE Bridge)
 */
export function watchRunEvents(runId, onEvent) {
  let active = true;

  const poll = async () => {
    try {
      const snapshot = await getFactoryRunSnapshot(runId);
      if (!active) return;
      onEvent({ type: "status", data: snapshot });

      const targetStageResult = snapshot.artifacts[snapshot.run.targetStage || "publish_enterprise"];
      const isDone = targetStageResult?.status === "done";
      
      // Fixed stream completion logic: Only abort if overall execution has failed terminally, 
      // or if target stage fails terminally (allowing retry steps to execute safely without tearing down).
      const isFailed = snapshot.run.status === "failed" || targetStageResult?.status === "failed";

      if (isDone || isFailed) {
        onEvent({ type: "completed", data: snapshot });
        active = false;
      }
    } catch (err) {
      if (active) onEvent({ type: "error", error: err.message });
      active = false;
    }
  };

  poll();
  const interval = setInterval(poll, 4000);

  return () => {
    active = false;
    clearInterval(interval);
  };
}
