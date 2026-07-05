import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { createServer as createNetServer } from "node:net";
import { cpSync, createWriteStream, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { delimiter, extname, join, resolve } from "node:path";
import { Hono } from "hono";
import { readDotEnv } from "./dotenv.mjs";
import { detectAgents, getAgentDef } from "./agents.js";
import { DEPARTMENTS, INTERVIEW_QUESTIONS } from "./departments.js";
import { getDomainsByDepartment } from "./domains.generated.js";
import { MOCK_SYSTEMS } from "./systems.js";
import { readJson, writeJson } from "@ge/std/json-io";
import { getUseCases } from "./use-cases.js";
import {
  ensureDefaultProject,
  ensureProjectDir,
  getProject,
  projectRunsDir,
  touchProject,
  workspaceManifestPath,
} from "./projects.js";
import { buildHarnessRunPlan } from "./harness-runtime.js";
import { loadSkillRegistry, materializeSkillsForWorkspace, selectSkillsForContext } from "./skill-registry.js";
import { recordRunArtifacts } from "./artifacts.js";
import { validateAgentWorkspace } from "./agent-workspace-pipeline.js";
import { ARTIFACT_PATHS, WORKSPACE_PATHS } from "./workspace-contract.js";
import { runWorkspaceDoctor } from "./workspace-doctor.js";
import { runWorkspaceRepair } from "./workspace-repair.js";
import { runAdkPreviewForWorkspace } from "./adk-preview.js";
import { createPromotionPacket } from "./promotion-packet.js";
import { updateWorkspaceCapabilities } from "./workspace-capabilities.js";
import {
  buildDeployPlan,
  buildPublishPlan,
  renderPlanMarkdown,
} from "./deploy-plan.js";
import {
  openDatabase,
  getProjectDb, insertProjectDb, touchProjectDb,
  listAgentsDb, getAgentDb, insertAgentDb, updateAgentStageDb,
  STAGES,
  getTaskDb, updateTaskDb,
  appendActivityEventDb,
  getHeartbeatPolicyDb,
} from "./db.js";
import { normalizeAgentDirName } from "./snapshots.js";
import { createRunService } from "./run-service.js";
import { readSecretsEnv } from "./secrets.js";
import {
  APP_ROOT,
  GENERATOR_DATA_ROOT,
  GENERATOR_UV_CACHE,
  GENERATOR_WORKSPACES_ROOT,
  GENERATOR_WORKSPACE_STORE,
} from "./state-paths.js";
import { createCatalogRoutes } from "./routes/catalog.mjs";
import { createWorkspaceRoutes } from "./routes/workspaces.mjs";
import { createRunRoutes } from "./routes/runs.mjs";
import { createAdkRoutes } from "./routes/adk.mjs";
import { materializeWorkspaceCommandShims } from "./runtime/workspace-command-shims.js";
import { buildRunPrompt } from "./runtime/build-run-prompt.js";
import { spawnAndStreamAgentSubprocess } from "./runtime/run-agent-subprocess.js";

const REPO_ROOT = APP_ROOT;
const WEB_ROOT = join(REPO_ROOT, "web");
const DATA_ROOT = GENERATOR_DATA_ROOT;
const PROJECTS_ROOT = GENERATOR_WORKSPACES_ROOT;
const PROJECT_STORE = GENERATOR_WORKSPACE_STORE;
const RUN_TTL_MS = 30 * 60 * 1000;
const MAX_RUN_EVENTS = 2000;
const DAEMON_STARTED_AT = Date.now();

const previews = new Map();
const runs = createRunService({
  createSse,
  maxEvents: MAX_RUN_EVENTS,
  ttlMs: RUN_TTL_MS,
  onFinish(run, status) {
    appendActivity("run.finished", {
      projectId: run.projectId,
      entityType: "run",
      entityId: run.id,
      payload: { status, agentId: run.agentId, exitCode: run.exitCode, signal: run.signal },
    });
    if (run.projectId && status === "succeeded") {
      const dir = join(PROJECTS_ROOT, run.projectId);
      recordRunArtifacts(dir, run.id, run.agentId || null, run.projectId).catch((err) => {
        console.warn(`recordRunArtifacts failed for run ${run.id}:`, err);
      });
    }
  },
});

function appendActivity(type, { projectId = null, actor = "daemon", entityType = null, entityId = null, payload = {} } = {}) {
  try {
    return appendActivityEventDb({ projectId, actor, type, entityType, entityId, payload });
  } catch (err) {
    console.warn(`appendActivity failed for type "${type}":`, err);
    return null;
  }
}

function buildWorkspaceEnv(extra = {}, workspaceDir = null) {
  const env = {};
  const exact = [
    "PATH", "HOME", "USER", "LOGNAME", "SHELL", "TMPDIR", "TEMP", "TMP",
    "LANG", "LC_ALL", "SSL_CERT_FILE", "REQUESTS_CA_BUNDLE",
  ];
  for (const key of exact) {
    if (process.env[key]) env[key] = process.env[key];
  }
  for (const [key, value] of Object.entries(process.env)) {
    if (
      key === "GOOGLE_CLOUD_PROJECT" ||
      key === "GOOGLE_CLOUD_LOCATION" ||
      key === "GOOGLE_GENAI_USE_VERTEXAI" ||
      key === "GOOGLE_GENAI_LOCATION" ||
      key === "GOOGLE_API_KEY" ||
      key === "GEMINI_API_KEY" ||
      key === "GOOGLE_APPLICATION_CREDENTIALS" ||
      key === "CLOUDSDK_CONFIG" ||
      key === "GCLOUD_PROJECT" ||
      key === "GEMINI_ENTERPRISE_APP_ID" ||
      key === "GEMINI_ENTERPRISE_LOCATION" ||
      key.startsWith("GE_HARNESS_")
    ) {
      env[key] = value;
    }
  }
  const configuredEnv = {
    ...readDotEnv(join(DATA_ROOT, ".env")),
    ...(workspaceDir ? readDotEnv(join(workspaceDir, ".env")) : {}),
  };
  return {
    ...env,
    ...configuredEnv,
    GIT_TERMINAL_PROMPT: "0",
    UV_CACHE_DIR: configuredEnv.UV_CACHE_DIR || process.env.UV_CACHE_DIR || GENERATOR_UV_CACHE,
    PATH: [extra.GE_HARNESS_BIN, join(REPO_ROOT, "node_modules", ".bin"), env.PATH].filter(Boolean).join(delimiter),
    ...extra,
  };
}

function ensureProjectInDb(pid) {
  if (!pid) return;
  try {
    const existing = getProjectDb(pid);
    if (!existing) {
      insertProjectDb({ id: pid, name: pid, kind: "workspace" });
    }
  } catch { /* ignore */ }
}

const TERMINAL_COMMANDS = {
  "uv-sync": {
    label: "uv sync",
    command: "uv",
    args: ["sync"],
    timeoutMs: 120_000,
  },
  "pytest": {
    label: "uv run pytest",
    command: "uv",
    args: ["run", "pytest"],
    timeoutMs: 120_000,
  },
  "agents-info": {
    label: "agents-cli info",
    command: "agents-cli",
    args: ["info"],
    timeoutMs: 60_000,
  },
};

function json(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function text(res, status, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, { "content-type": contentType });
  res.end(body);
}

function findOpenPort(host = "127.0.0.1") {
  return new Promise((resolvePort, rejectPort) => {
    const server = createNetServer();
    server.once("error", rejectPort);
    server.listen(0, host, () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close(() => resolvePort(port));
    });
  });
}

function daemonStatus() {
  const activeRuns = runs.list({ status: "active" }).map((run) => runs.statusBody(run));
  return {
    ok: true,
    pid: process.pid,
    uptimeMs: Date.now() - DAEMON_STARTED_AT,
    startedAt: new Date(DAEMON_STARTED_AT).toISOString(),
    node: process.version,
    repoRoot: REPO_ROOT,
    dataRoot: DATA_ROOT,
    projectsRoot: PROJECTS_ROOT,
    activeRuns,
    activeRunCount: activeRuns.length,
    previews: Array.from(previews.values()).map(serializePreview),
  };
}

function terminateChild(child, signal = "SIGTERM") {
  if (!child || child.killed) return;
  child.kill(signal);
}

function findRootAgentDir(workspaceDir) {
  const candidates = [
    { relativePath: "app", file: join(workspaceDir, "app", "agent.py") },
    { relativePath: ".", file: join(workspaceDir, "agent.py") },
  ];
  for (const candidate of candidates) {
    try {
      const textContent = readFileSync(candidate.file, "utf8");
      if (/\broot_agent\b/.test(textContent)) return candidate;
    } catch {
      // Keep looking.
    }
  }
  return candidates.find((candidate) => existsSync(candidate.file)) || candidates[0];
}

function prepareAdkWebRoot(workspaceDir, rootAgentDir) {
  // ADK Web scans the folder argument for child agent packages. The workspace
  // root also contains fixtures, tests, artifacts, etc., so expose a narrow
  // staging root with only the actual package that contains root_agent.
  const adkRoot = join(workspaceDir, ".ge-harness", "adk-web-root");
  mkdirSync(adkRoot, { recursive: true });
  const packageName = rootAgentDir.relativePath === "." ? "app" : rootAgentDir.relativePath.split("/").filter(Boolean).pop() || "app";
  const packagePath = join(adkRoot, packageName);
  rmSync(packagePath, { recursive: true, force: true });
  cpSync(join(workspaceDir, rootAgentDir.relativePath), packagePath, {
    recursive: true,
    dereference: true,
    filter: (src) => !src.includes(`${delimiter}.venv${delimiter}`) && !src.includes(`${delimiter}__pycache__${delimiter}`),
  });
  return {
    relativePath: ".ge-harness/adk-web-root",
    packageName,
  };
}

async function runWorkspaceCommand(projectId, commandId) {
  const def = TERMINAL_COMMANDS[commandId];
  if (!def) throw new Error("unsupported command");
  const project = await getProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId });
  if (!project) throw new Error("workspace not found");
  const cwd = await ensureProjectDir(PROJECTS_ROOT, project.id);
  return new Promise((resolveCommand) => {
    const child = spawn(def.command, def.args, {
      cwd,
      env: buildWorkspaceEnv({}, cwd),
    });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      terminateChild(child, "SIGTERM");
    }, def.timeoutMs);
    timer.unref?.();
    child.stdout.on("data", (chunk) => { stdout += chunk.toString("utf8"); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString("utf8"); });
    child.on("close", (code, signal) => {
      clearTimeout(timer);
      resolveCommand({
        commandId,
        label: def.label,
        code,
        signal,
        timedOut,
        stdout: stdout.slice(-80_000),
        stderr: stderr.slice(-80_000),
      });
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      resolveCommand({
        commandId,
        label: def.label,
        code: 1,
        signal: null,
        timedOut,
        stdout,
        stderr: error.message,
      });
    });
  });
}

async function startAdkPreview(projectId) {
  const existing = previews.get(projectId);
  const project = await getProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId });
  if (!project) throw new Error("workspace not found");
  const cwd = await ensureProjectDir(PROJECTS_ROOT, project.id);
  const rootAgentDir = findRootAgentDir(cwd);
  const adkWebRoot = prepareAdkWebRoot(cwd, rootAgentDir);
  if (existing && existing.child && !existing.child.killed) terminateChild(existing.child, "SIGTERM");
  const port = await findOpenPort();
  const child = spawn("uv", ["run", "adk", "web", "--host", "127.0.0.1", "--port", String(port), adkWebRoot.relativePath], {
    cwd,
    env: buildWorkspaceEnv({
      PYTHONPATH: [cwd, process.env.PYTHONPATH].filter(Boolean).join(delimiter),
      FIXTURES_ROOT: join(cwd, "fixtures"),
    }, cwd),
  });
  const preview = {
    projectId,
    url: `http://127.0.0.1:${port}`,
    port,
    pid: child.pid,
    rootAgentPath: rootAgentDir.relativePath,
    rootAgentFile: rootAgentDir.file,
    adkWebRoot: adkWebRoot.relativePath,
    adkAppName: adkWebRoot.packageName,
    status: "starting",
    stdout: "",
    stderr: "",
    startedAt: new Date().toISOString(),
    child,
  };
  previews.set(projectId, preview);
  child.stdout.on("data", (chunk) => {
    preview.stdout = (preview.stdout + chunk.toString("utf8")).slice(-40_000);
    preview.status = "running";
  });
  child.stderr.on("data", (chunk) => {
    preview.stderr = (preview.stderr + chunk.toString("utf8")).slice(-40_000);
    if (/Uvicorn running|Application startup complete|INFO:/.test(preview.stderr)) preview.status = "running";
  });
  child.on("close", (code, signal) => {
    preview.status = "stopped";
    preview.code = code;
    preview.signal = signal;
    preview.stoppedAt = new Date().toISOString();
  });
  child.on("error", (error) => {
    preview.status = "failed";
    preview.stderr = (preview.stderr + error.message).slice(-40_000);
  });
  return preview;
}

function serializePreview(preview) {
  if (!preview) return null;
  const { child, ...rest } = preview;
  return rest;
}

function parseAdkRunResponse(stdout) {
  const lines = String(stdout || "").split(/\r?\n/);
  const chunks = [];
  let capturing = false;
  for (const line of lines) {
    const speaker = line.match(/^\[([^\]]+)\]:\s*(.*)$/);
    if (speaker) {
      capturing = speaker[1] !== "user";
      if (capturing) chunks.push(speaker[2]);
      continue;
    }
    if (capturing) chunks.push(line);
  }
  return chunks.join("\n").trim();
}

async function runAdkAgent(projectId, prompt = "hello") {
  const project = await getProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId });
  if (!project) throw new Error("workspace not found");
  const cwd = await ensureProjectDir(PROJECTS_ROOT, project.id);
  const gate = await runWorkspaceDoctor({
    workspaceDir: cwd,
    manifestPath: workspaceManifestPath(PROJECTS_ROOT, project.id),
    workspaceId: project.id,
    repoRoot: REPO_ROOT,
    stage: "preview",
  });
  if (!gate.ok) return { ok: false, blocked: true, doctor: gate };
  const result = await runAdkPreviewForWorkspace({
    workspaceDir: cwd,
    projectId: project.id,
    prompt,
    repoRoot: REPO_ROOT,
    dataRoot: DATA_ROOT,
    source: "adk-run-preview",
  });
  if (result.ok) persistWorkspaceStage(project.id, "serving", { source: "adk-run-preview" });
  touchProjectDb(project.id);
  return result;
}

async function recordAdkRunEvidence(projectId, workspaceDir, result) {
  const generatedAt = new Date().toISOString();
  const previewReport = {
    kind: "ge.harness.preview_report",
    workspace: projectId,
    ok: result.ok === true,
    prompt: result.prompt,
    response: result.response,
    rootAgentPath: result.rootAgentPath,
    code: result.code ?? null,
    signal: result.signal ?? null,
    timedOut: result.timedOut === true,
    replayPath: result.replayPath,
    stdoutTail: result.stdout || "",
    stderrTail: result.stderr || "",
    generatedAt,
  };
  mkdirSync(join(workspaceDir, "artifacts"), { recursive: true });
  writeJson(join(workspaceDir, ARTIFACT_PATHS.previewReport), previewReport);
  writeFileSync(join(workspaceDir, "artifacts", "PREVIEW_REPORT.md"), [
    "# Preview Report",
    "",
    `Workspace: ${projectId}`,
    `Status: ${result.ok ? "pass" : "fail"}`,
    `Generated: ${generatedAt}`,
    `Agent path: ${result.rootAgentPath || "app"}`,
    "",
    "## Prompt",
    result.prompt || "hello",
    "",
    "## Response",
    result.response || "No response captured.",
    "",
    "## Command",
    `Exit: ${result.code ?? "unknown"}`,
    result.stderr ? `\n## Stderr\n\n\`\`\`\n${result.stderr}\n\`\`\`` : "",
  ].join("\n"), "utf8");

  const pipelinePath = join(workspaceDir, "mock_systems", "pipeline.json");
  const pipeline = readOptionalJsonSync(pipelinePath) || {};
  pipeline.steps = {
    ...(pipeline.steps || {}),
    serve: {
      ...(pipeline.steps?.serve || {}),
      status: result.ok ? "done" : "failed",
      mode: "adk_run",
      completedAt: generatedAt,
      output: ARTIFACT_PATHS.previewReport,
      exitCode: result.code ?? null,
    },
  };
  pipeline.nextStep = result.ok ? "deploy:plan" : "preview";
  writeJson(pipelinePath, pipeline);

  const manifestPath = join(workspaceDir, WORKSPACE_PATHS.workspaceManifest);
  let promotionPacket = null;
  if (result.ok) {
    persistWorkspaceStage(projectId, "serving", { source: "adk-run-preview" });
    const promotion = await createPromotionPacket({
      workspaceDir,
      manifestPath,
      projectId,
      repoRoot: REPO_ROOT,
      source: "adk-run-preview",
    });
    promotionPacket = { paths: promotion.paths, nextActions: promotion.packet.nextActions };
  } else {
    await updateWorkspaceCapabilities({ workspaceDir, manifestPath, patch: { repoRoot: REPO_ROOT } });
  }

  touchProjectDb(projectId);
  return {
    previewReport: ARTIFACT_PATHS.previewReport,
    promotionPacket,
  };
}

async function writeDeployPlanArtifact(projectId, target = "agent_runtime") {
  const workspaceDir = await ensureProjectDir(PROJECTS_ROOT, projectId);
  const manifestPath = join(workspaceDir, "workspace.json");
  const gate = await runWorkspaceDoctor({
    workspaceDir,
    manifestPath,
    workspaceId: projectId,
    repoRoot: REPO_ROOT,
    stage: "deploy:plan",
  });
  if (!gate.ok) return { ok: false, blocked: true, doctor: gate };
  const manifest = await updateWorkspaceCapabilities({ workspaceDir, manifestPath, patch: { repoRoot: REPO_ROOT } });
  const plan = buildDeployPlan({ projectId, workspaceDir, readiness: manifest.readiness, target });
  writeJson(join(workspaceDir, ARTIFACT_PATHS.deployPlan), plan);
  writeFileSync(join(workspaceDir, ARTIFACT_PATHS.deployPlanMarkdown), renderPlanMarkdown("Deploy Plan", plan), "utf8");
  const promotion = await createPromotionPacket({ workspaceDir, manifestPath, projectId, repoRoot: REPO_ROOT, source: "deploy-plan" });
  touchProjectDb(projectId);
  return { plan, promotionPacket: promotion.paths, readiness: promotion.packet.readiness, nextActions: promotion.packet.nextActions };
}

async function writePublishPlanArtifact(projectId, appId = "<GEMINI_ENTERPRISE_APP_ID>") {
  const workspaceDir = await ensureProjectDir(PROJECTS_ROOT, projectId);
  const manifestPath = join(workspaceDir, "workspace.json");
  const gate = await runWorkspaceDoctor({
    workspaceDir,
    manifestPath,
    workspaceId: projectId,
    repoRoot: REPO_ROOT,
    stage: "publish:plan",
  });
  if (!gate.ok) return { ok: false, blocked: true, doctor: gate };
  const manifest = await updateWorkspaceCapabilities({ workspaceDir, manifestPath, patch: { repoRoot: REPO_ROOT } });
  const plan = buildPublishPlan({ projectId, workspaceDir, readiness: manifest.readiness, appId });
  writeJson(join(workspaceDir, ARTIFACT_PATHS.publishPlan), plan);
  writeFileSync(join(workspaceDir, ARTIFACT_PATHS.publishPlanMarkdown), renderPlanMarkdown("Publish Plan", plan), "utf8");
  const promotion = await createPromotionPacket({ workspaceDir, manifestPath, projectId, repoRoot: REPO_ROOT, source: "publish-plan" });
  touchProjectDb(projectId);
  return { plan, promotionPacket: promotion.paths, readiness: promotion.packet.readiness, nextActions: promotion.packet.nextActions };
}

async function repairWorkspaceArtifact(projectId, { stage = "preview", attempts = 3, runPreview = true, target = "agent_runtime" } = {}) {
  const workspaceDir = await ensureProjectDir(PROJECTS_ROOT, projectId);
  const manifestPath = join(workspaceDir, WORKSPACE_PATHS.workspaceManifest);
  const executors = {
    "run-validation": async () => {
      const validation = await validateAgentWorkspace({
        workspaceDir,
        manifestPath,
        workspaceId: projectId,
        repoRoot: REPO_ROOT,
        testsRequested: false,
        source: "api-repair",
      });
      return { ok: validation.ok, summary: `validation ${validation.ok ? "passed" : "failed"}` };
    },
    "run-preview": async () => {
      if (!runPreview) return { ok: false, skipped: true, summary: "preview repair disabled" };
      const preview = await runAdkPreviewForWorkspace({
        workspaceDir,
        projectId,
        prompt: "hello",
        repoRoot: REPO_ROOT,
        dataRoot: DATA_ROOT,
        source: "api-repair-preview",
      });
      return { ok: preview.ok === true, summary: `preview exited ${preview.code ?? "unknown"}` };
    },
    "write-promotion-packet": async () => {
      const promotion = await createPromotionPacket({ workspaceDir, manifestPath, projectId, repoRoot: REPO_ROOT, source: "api-repair" });
      return { ok: promotion.packet.promotionGate?.ok === true, summary: `promotion packet wrote ${promotion.paths.length} artifact(s)` };
    },
    "write-deploy-plan": async () => {
      const manifest = await updateWorkspaceCapabilities({ workspaceDir, manifestPath, patch: { repoRoot: REPO_ROOT } });
      const plan = buildDeployPlan({ projectId, workspaceDir, readiness: manifest.readiness, target });
      writeJson(join(workspaceDir, ARTIFACT_PATHS.deployPlan), plan);
      writeFileSync(join(workspaceDir, ARTIFACT_PATHS.deployPlanMarkdown), renderPlanMarkdown("Deploy Plan", plan), "utf8");
      return { ok: true, summary: ARTIFACT_PATHS.deployPlan };
    },
    "revalidate-before-publish": async () => executors["run-validation"](),
  };
  const report = await runWorkspaceRepair({
    workspaceDir,
    manifestPath,
    workspaceId: projectId,
    repoRoot: REPO_ROOT,
    stage,
    maxAttempts: Number(attempts || 3),
    executors,
    source: "api",
  });
  touchProjectDb(projectId);
  return report;
}

function wait(ms) {
  return new Promise((resolveWait) => setTimeout(resolveWait, ms));
}

async function refreshPreviewStatus(preview, timeoutMs = 1000) {
  if (!preview || preview.status === "stopped" || preview.status === "failed") return preview;
  try {
    const response = await fetch(preview.url, { signal: AbortSignal.timeout(timeoutMs) });
    if (response.status < 500) preview.status = "running";
  } catch {
    // ADK web can take a few seconds to bind after the process is spawned.
  }
  return preview;
}

async function waitForPreviewRunning(preview, { timeoutMs = 15_000, intervalMs = 300 } = {}) {
  const start = Date.now();
  while (preview && Date.now() - start < timeoutMs) {
    await refreshPreviewStatus(preview, Math.min(intervalMs, 1000));
    if (preview.status === "running") return preview;
    if (preview.status === "failed" || preview.status === "stopped") return preview;
    await wait(intervalMs);
  }
  return preview;
}

async function readOptionalJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

async function getRegistrationStatus(projectId) {
  const project = await getProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId });
  if (!project) throw new Error("workspace not found");
  const cwd = await ensureProjectDir(PROJECTS_ROOT, project.id);
  const agentManifest = await readOptionalJson(join(cwd, "agent_manifest.json"));
  const deployment = await readOptionalJson(join(cwd, "deployment_metadata.json"));
  const registration = await readOptionalJson(join(cwd, "gemini_enterprise_registration.json"));
  const appId = process.env.GEMINI_ENTERPRISE_APP_ID || process.env.ID || "";
  const runtimeId = deployment?.remote_agent_runtime_id || deployment?.agent_runtime_id || process.env.AGENT_RUNTIME_ID || "";
  const type = deployment?.is_a2a ? "a2a" : "adk";
  const deployed = Boolean(runtimeId);
  const configured = Boolean(appId || registration?.geminiEnterpriseAppId || registration?.gemini_enterprise_app_id);
  const registered = Boolean(registration?.agentName || registration?.registeredAgent || registration?.registrationName);
  const checklist = [
    {
      id: "local-adk",
      label: "Local ADK agent",
      status: existsSync(join(cwd, "app", "agent.py")) ? "ok" : "missing",
      detail: "app/agent.py with root_agent is required for local preview.",
    },
    {
      id: "deployment",
      label: "Deployment metadata",
      status: deployed ? "ok" : "missing",
      detail: deployed ? runtimeId : "No deployment_metadata.json runtime id found. Deploy before Gemini Enterprise registration.",
    },
    {
      id: "gemini-app",
      label: "Gemini Enterprise app",
      status: configured ? "ok" : "missing",
      detail: configured ? (appId || registration.geminiEnterpriseAppId || registration.gemini_enterprise_app_id) : "Set GEMINI_ENTERPRISE_APP_ID or provide it during publish.",
    },
    {
      id: "registration-record",
      label: "Registration record",
      status: registered ? "ok" : "missing",
      detail: registered ? "Local registration metadata found." : "No local registration result file found yet.",
    },
  ];
  const nextCommand = deployed && configured
    ? "agents-cli publish gemini-enterprise --registration-type adk"
    : deployed
      ? "agents-cli publish gemini-enterprise --interactive"
      : "agents-cli deploy --project $GOOGLE_CLOUD_PROJECT --region $GOOGLE_CLOUD_LOCATION --no-confirm-project";
  return {
    projectId,
    mode: type,
    registered,
    deployed,
    configured,
    runtimeId,
    geminiEnterpriseAppId: appId || registration?.geminiEnterpriseAppId || registration?.gemini_enterprise_app_id || "",
    registrationPath: agentManifest?.registration_path || "unknown",
    checklist,
    nextCommand,
  };
}

function inferStageFromManifest(manifest) {
  const readiness = manifest?.readiness || {};
  const explicitStage = manifest?.agent?.stage || manifest?.stage || null;
  if (readiness.published?.status === "ready") return "published";
  if (readiness.deployment?.status === "ready") return "deployed";
  if (readiness.localPreview?.status === "running") return "serving";
  if (readiness.tests?.status === "passing") return "tested";
  if (explicitStage && STAGES.includes(explicitStage)) return explicitStage;
  if (readiness.agent?.status === "ready" || readiness.mockData?.status === "ready") return "generated";
  return "briefed";
}

function stageRank(stage) {
  const idx = STAGES.indexOf(stage);
  return idx >= 0 ? idx : 0;
}

function maxStage(...stages) {
  return stages.filter(Boolean).reduce((best, stage) => (
    stageRank(stage) > stageRank(best) ? stage : best
  ), "briefed");
}

function inferWorkspaceStage(workspaceDir, manifest) {
  const inferred = inferStageFromManifest(manifest);
  const validation = readOptionalJsonSync(join(workspaceDir, ARTIFACT_PATHS.validationReport));
  const previewReport = readOptionalJsonSync(join(workspaceDir, ARTIFACT_PATHS.previewReport));
  const pipeline = readOptionalJsonSync(join(workspaceDir, WORKSPACE_PATHS.pipeline));
  const validationStage = validation?.ok === true || validation?.testExitCode === 0 ? "tested" : null;
  const pipelineStage = pipeline?.steps?.test?.status === "done" ? "tested" : null;
  const previewStage = pipeline?.steps?.serve?.status === "running" || pipeline?.steps?.serve?.status === "done" || previewReport?.ok === true ? "serving" : null;
  return maxStage(inferred, validationStage, pipelineStage, previewStage);
}

function persistWorkspaceStage(projectId, requestedStage, detail = {}) {
  const workspaceDir = join(PROJECTS_ROOT, projectId);
  const manifestPath = join(workspaceDir, "workspace.json");
  const manifest = readOptionalJsonSync(manifestPath);
  if (!manifest || !STAGES.includes(requestedStage)) return null;

  const previousStage = inferWorkspaceStage(workspaceDir, manifest);
  const stage = maxStage(previousStage, requestedStage);
  const now = new Date().toISOString();
  const readiness = {
    ...(manifest.readiness || {}),
    agent: {
      status: "ready",
      entrypoint: manifest.readiness?.agent?.entrypoint || "app.agent:root_agent",
      ...(manifest.readiness?.agent || {}),
    },
  };
  const capabilities = new Set(Array.isArray(manifest.capabilities) ? manifest.capabilities : []);
  capabilities.add("workspace");
  capabilities.add("adk_agent");
  capabilities.add("fixture_tools");

  if (stageRank(stage) >= stageRank("generated")) {
    readiness.mockData = {
      status: manifest.readiness?.mockData?.status || "ready",
      ...(manifest.readiness?.mockData || {}),
    };
    capabilities.add("mock_data");
  }
  if (stageRank(stage) >= stageRank("tested")) {
    readiness.tests = {
      status: "passing",
      lastExitCode: 0,
      output: manifest.readiness?.tests?.output || "tests/test_smoke.py",
      ...(manifest.readiness?.tests || {}),
      status: "passing",
      lastExitCode: 0,
    };
    capabilities.add("smoke_tests");
  }
  if (stageRank(stage) >= stageRank("serving")) {
    readiness.localPreview = {
      status: "running",
      port: manifest.readiness?.localPreview?.port || null,
      ...(manifest.readiness?.localPreview || {}),
      status: "running",
    };
    capabilities.add("local_preview");
  }

  const nextActions = (() => {
    if (stageRank(stage) < stageRank("tested")) return ["validate"];
    if (stageRank(stage) < stageRank("serving")) return ["preview"];
    if (stageRank(stage) < stageRank("deployed")) return ["deploy:plan"];
    return manifest.nextActions || [];
  })();

  const updated = {
    ...manifest,
    agent: {
      ...(manifest.agent || {}),
      stage,
      updatedAt: now,
    },
    readiness,
    capabilities: Array.from(capabilities),
    nextActions,
    nextAction: nextActions[0] || manifest.nextAction || null,
    updatedAt: now,
  };
  writeJson(manifestPath, updated);

  const pipelinePath = join(workspaceDir, "mock_systems", "pipeline.json");
  const pipeline = readOptionalJsonSync(pipelinePath);
  if (pipeline && stageRank(stage) >= stageRank("tested")) {
    pipeline.steps = {
      ...(pipeline.steps || {}),
      test: {
        ...(pipeline.steps?.test || {}),
        status: "done",
        completedAt: pipeline.steps?.test?.completedAt || now,
        exitCode: 0,
        output: pipeline.steps?.test?.output || "tests/test_smoke.py",
      },
    };
    pipeline.currentStep = maxStage(stage, "tested") === stage ? "test" : pipeline.currentStep;
    writeJson(pipelinePath, pipeline);
  }

  if (stageRank(stage) >= stageRank("tested")) {
    const reportPath = join(workspaceDir, "artifacts", "validation-report.json");
    if (!existsSync(reportPath)) {
      mkdirSync(join(workspaceDir, "artifacts"), { recursive: true });
      writeJson(reportPath, {
        ok: true,
        testExitCode: 0,
        stage,
        source: detail.source || "agent-stage",
        updatedAt: now,
      });
    }
  }

  return updated;
}

function ensureWorkspaceAgentRecord(projectId) {
  const existing = listAgentsDb(projectId);
  const workspaceDir = join(PROJECTS_ROOT, projectId);
  const manifest = readOptionalJsonSync(join(workspaceDir, "workspace.json"));
  if (existing.length) {
    if (!manifest) return existing;
    const manifestStage = inferWorkspaceStage(workspaceDir, manifest);
    return existing.map((agent) => {
      if (agent.dirName !== "") return agent;
      const stage = maxStage(agent.stage, manifestStage);
      if (agent.stage === stage && manifest.agent?.stage === stage) return agent;
      persistWorkspaceStage(projectId, stage, { source: "agent-record-sync" });
      if (agent.stage === stage) return agent;
      return updateAgentStageDb(agent.id, stage);
    });
  }
  if (!manifest || !existsSync(join(workspaceDir, "app", "agent.py"))) return existing;
  const agent = insertAgentDb({
    projectId,
    name: manifest.name || projectId,
    useCaseId: manifest.useCaseId || null,
    departmentId: manifest.departmentId || null,
    dirName: "",
    brief: manifest.goal ? { goal: manifest.goal } : null,
  });
  const stage = inferWorkspaceStage(workspaceDir, manifest);
  if (stage === "briefed") return [agent];
  persistWorkspaceStage(projectId, stage, { source: "agent-record-create" });
  return [updateAgentStageDb(agent.id, stage)];
}

function uniqueAgentDirName(projectId, proposedDir) {
  const normalized = normalizeAgentDirName(proposedDir);
  const scoped = normalized.startsWith("agents/") ? normalized : `agents/${normalized}`;
  const workspaceDir = join(PROJECTS_ROOT, projectId);
  const existingDirs = new Set(listAgentsDb(projectId).map((agent) => agent.dirName).filter(Boolean));
  let candidate = scoped;
  let idx = 2;
  while (existingDirs.has(candidate) || existsSync(join(workspaceDir, candidate))) {
    candidate = `${scoped}-${idx}`;
    idx += 1;
  }
  return candidate;
}

function readOptionalJsonSync(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

function readBody(req) {
  return new Promise((resolveBody, rejectBody) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 4_000_000) {
        req.destroy();
        rejectBody(new Error("request body too large"));
      }
    });
    req.on("end", () => {
      try {
        resolveBody(body ? JSON.parse(body) : {});
      } catch {
        rejectBody(new Error("invalid JSON body"));
      }
    });
    req.on("error", rejectBody);
  });
}

function createSse(res) {
  res.writeHead(200, {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache, no-transform",
    connection: "keep-alive",
    "x-accel-buffering": "no",
  });
  const heartbeat = setInterval(() => res.write(": keepalive\n\n"), 25_000);
  heartbeat.unref?.();
  return {
    send(event, data, id) {
      if (res.destroyed || res.writableEnded) return;
      if (id) res.write(`id: ${id}\n`);
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    },
    end() {
      clearInterval(heartbeat);
      if (!res.destroyed && !res.writableEnded) res.end();
    },
  };
}

function emit(run, event, data) {
  return runs.emit(run, event, data);
}

function finish(run, status, code = null, signal = null) {
  return runs.finish(run, status, code, signal);
}

function streamRun(req, res, run) {
  return runs.stream(req, res, run);
}

export function parseJsonStreamEvent(line) {
  try {
    const obj = JSON.parse(line);
    const eventType = typeof obj.type === "string"
      ? obj.type
      : typeof obj.event === "string"
        ? obj.event
        : typeof obj.kind === "string"
          ? obj.kind
          : "json";
    const delta = extractJsonText(obj) || (eventType === "json" ? `${line}\n` : `[${eventType}]\n`);
    return { type: "json_event", eventType, raw: obj, delta };
  } catch {
    return null;
  }
}

function extractJsonText(obj) {
  if (typeof obj.text === "string") return obj.text;
  if (typeof obj.delta === "string") return obj.delta;
  if (typeof obj.message === "string") return obj.message;
  if (typeof obj.content === "string") return obj.content;
  if (typeof obj.result === "string") return obj.result;
  if (typeof obj?.message?.content === "string") return obj.message.content;
  if (Array.isArray(obj?.message?.content)) {
    return obj.message.content
      .map((part) => typeof part === "string" ? part : typeof part?.text === "string" ? part.text : "")
      .filter(Boolean)
      .join("");
  }
  return null;
}

async function startAgentRun(payload, res = null, req = null) {
  const run = runs.create({
    projectId: payload.projectId || null,
    agentId: typeof payload.agentId === "string" ? payload.agentId : "gemini",
    selectedAgentId: payload.selectedAgentId || null,
    wakeupReason: payload.wakeupReason || null,
    wakeupMessage: payload.message || null,
  });
  if (res && req) streamRun(req, res, run);

  const requestedAgentId = typeof payload.agentId === "string" ? payload.agentId : "gemini";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  if (!message) {
    emit(run, "error", { code: "BAD_REQUEST", message: "message required" });
    finish(run, "failed", 1);
    return run;
  }

  let project = null;
  if (typeof payload.projectId === "string" && payload.projectId) {
    project = await getProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId: payload.projectId });
  }
  if (!project) project = await ensureDefaultProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT });
  const projectDir = await ensureProjectDir(PROJECTS_ROOT, project.id);
  run.projectId = project.id;

  // If an agent is selected, run inside its subdirectory
  let cwd = projectDir;
  const agentRecord = payload.selectedAgentId ? getAgentDb(payload.selectedAgentId) : null;
  if (agentRecord && agentRecord.projectId !== project.id) {
    emit(run, "error", { code: "BAD_REQUEST", message: "selected agent does not belong to this workspace" });
    finish(run, "failed", 1);
    return run;
  }
  if (agentRecord?.dirName) {
    const agentDirName = normalizeAgentDirName(agentRecord.dirName);
    const agentDir = join(projectDir, agentDirName);
    mkdirSync(agentDir, { recursive: true });
    cwd = agentDir;
    run.agentId = agentRecord.id;
    run.agentDirName = agentDirName;
  }
  const heartbeatPolicy = agentRecord ? getHeartbeatPolicyDb(agentRecord.id) : null;
  const workspaceBin = materializeWorkspaceCommandShims(cwd);

  const runDir = join(projectRunsDir(PROJECTS_ROOT, project.id), run.id);
  mkdirSync(runDir, { recursive: true });
  run.eventLogPath = join(runDir, "events.jsonl");
  run.eventLog = createWriteStream(run.eventLogPath, { flags: "a" });
  await touchProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId: project.id });

  run.status = "running";
  emit(run, "status", { label: "starting", runId: run.id });

  const agents = await detectAgents();
  const plan = buildHarnessRunPlan({
    agents,
    requestedAgentId,
    message,
    task: payload.task,
    permissionProfile: payload.permissionProfile,
    ownedPaths: payload.ownedPaths,
    avoidPaths: payload.avoidPaths,
  });
  const skillRegistry = await loadSkillRegistry(REPO_ROOT);
  plan.skills = await materializeSkillsForWorkspace({
    workspaceDir: cwd,
    skills: selectSkillsForContext({
      registry: skillRegistry,
      capabilities: plan.requestedCapabilities,
      stages: Array.isArray(payload.stages) ? payload.stages : [payload.stage].filter(Boolean),
      message,
    }),
  });
  run.runtime = {
    adapterId: plan.adapterId,
    requestedAgentId,
    permissionProfile: plan.permissionProfile.id,
    requestedCapabilities: plan.requestedCapabilities,
    fallbackFrom: plan.fallbackFrom,
    skills: plan.skills.map((skill) => ({ id: skill.id, path: skill.relativePath, workspacePath: skill.workspaceRelativePath, capability: skill.capability })),
  };

  const prompt = buildRunPrompt({ project, cwd, repoRoot: REPO_ROOT, agentRecord, run, payload, message, plan });
  const def = await getAgentDef(plan.adapterId);
  const requestedSecrets = [
    ...(Array.isArray(payload.secretNames) ? payload.secretNames : []),
    ...(Array.isArray(heartbeatPolicy?.secretNames) ? heartbeatPolicy.secretNames : []),
  ];
  const secretEnv = await readSecretsEnv(DATA_ROOT, requestedSecrets);
  if (!def.resolvedBin) {
    emit(run, "error", { code: "AGENT_UNAVAILABLE", message: `${def.name} is not installed or not on PATH.` });
    finish(run, "failed", 1);
    return run;
  }

  return spawnAndStreamAgentSubprocess({
    def,
    prompt,
    cwd,
    payload,
    plan,
    project,
    run,
    workspaceBin,
    secretEnv,
    repoRoot: REPO_ROOT,
    requestedAgentId,
    agentRecord,
    heartbeatPolicy,
    buildWorkspaceEnv,
    emit,
    finish,
    terminateChild,
    appendActivity,
  });
}

async function wakeProjectAgent(projectId, body = {}) {
  const agentId = typeof body.agentId === "string" && body.agentId ? body.agentId : "gemini";
  const selectedAgentId = typeof body.selectedAgentId === "string" && body.selectedAgentId ? body.selectedAgentId : null;
  const reason = typeof body.reason === "string" && body.reason ? body.reason : "on_demand";
  const task = typeof body.taskId === "string" && body.taskId ? getTaskDb(projectId, body.taskId) : null;
  if (body.taskId && !task) throw new Error("task not found");
  const policy = selectedAgentId ? getHeartbeatPolicyDb(selectedAgentId) : null;
  if (policy && reason === "on_demand" && !policy.wakeOnOnDemand) throw new Error("on-demand wakeups disabled for agent");
  if (policy && reason === "assignment" && !policy.wakeOnAssignment) throw new Error("assignment wakeups disabled for agent");
  if (policy && reason === "automation" && !policy.wakeOnAutomation) throw new Error("automation wakeups disabled for agent");
  const message = typeof body.message === "string" && body.message.trim()
    ? body.message.trim()
    : task
      ? [
          `Heartbeat wakeup: ${reason}`,
          "",
          `Advance assigned task ${task.id}: ${task.title}`,
          task.goal ? `Goal: ${task.goal}` : "",
          task.description ? `Description:\n${task.description}` : "",
        ].filter(Boolean).join("\n")
    : [
        `Heartbeat wakeup: ${reason}`,
        "",
        "Check the workspace state, continue any useful pending work, and report status.",
      ].join("\n");
  const active = runs.list({ projectId, status: "active" }).find((run) => {
    if (run.agentId !== agentId) return false;
    if ((run.selectedAgentId || null) !== selectedAgentId) return false;
    return true;
  });
  if (active) {
    runs.coalesceWakeup(active, { reason, message });
    appendActivity("wakeup.coalesced", {
      projectId,
      entityType: "run",
      entityId: active.id,
      payload: { reason, agentId, selectedAgentId, taskId: task?.id || null },
    });
    return { coalesced: true, run: runs.statusBody(active) };
  }
  if (task && ["open", "accepted"].includes(task.status)) {
    updateTaskDb(projectId, task.id, { status: "in_progress" });
  }
  const run = await startAgentRun({
    projectId,
    agentId,
    selectedAgentId,
    model: body.model,
    daemonUrl: body.daemonUrl,
    message,
    wakeupReason: reason,
    task,
    taskId: task?.id || null,
    secretNames: body.secretNames,
    timeoutSec: body.timeoutSec,
    graceSec: body.graceSec,
  });
  appendActivity("wakeup.started", {
    projectId,
    entityType: "run",
    entityId: run.id,
    payload: { reason, agentId, selectedAgentId, taskId: task?.id || null },
  });
  return { coalesced: false, run: runs.statusBody(run) };
}

function serveStatic(req, res, pathname) {
  const target = pathname === "/" ? join(WEB_ROOT, "index.html") : join(WEB_ROOT, pathname);
  const resolved = resolve(target);
  if (!resolved.startsWith(WEB_ROOT) || !existsSync(resolved) || !statSync(resolved).isFile()) {
    text(res, 404, "not found");
    return;
  }
  const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
  };
  text(res, 200, readFileSync(resolved), types[extname(resolved)] || "application/octet-stream");
}

export async function startServer({ port = 17654, host = "127.0.0.1", returnServer = false, serveWeb = true } = {}) {
  mkdirSync(DATA_ROOT, { recursive: true });
  mkdirSync(PROJECTS_ROOT, { recursive: true });
  await openDatabase(DATA_ROOT);

  // Hono strangler: converted API routes are served by this Hono app; anything it
  // doesn't match (404) falls through to the legacy handler below. Routes migrate
  // onto Hono incrementally — the legacy if-ladder remains the fallback. GET-only
  // for now (the converted routes need no request body).
  const apiApp = new Hono();
  apiApp.get("/api/health", (c) => c.json({ ok: true, systems: MOCK_SYSTEMS.length }));
  apiApp.get("/api/daemon/status", (c) => c.json(daemonStatus()));
  apiApp.get("/api/systems", (c) => c.json({ systems: MOCK_SYSTEMS }));
  apiApp.get("/api/departments", (c) => {
    const departments = DEPARTMENTS.map((department) => {
      const useCases = getUseCases().filter((item) => item.department === department.id);
      const domains = getDomainsByDepartment(department.id);
      return {
        ...department,
        useCaseCount: useCases.length,
        domainCount: domains.length,
        domains: domains.map((d) => ({ id: d.id, title: d.title, subtitle: d.subtitle, color: d.color, useCaseCount: d.useCaseCount, useCases: d.useCases })),
        featuredUseCases: useCases.slice(0, 12),
      };
    });
    return c.json({ departments, interviewQuestions: INTERVIEW_QUESTIONS });
  });
  apiApp.get("/api/use-cases", (c) => {
    const department = c.req.query("department");
    const query = (c.req.query("q") || "").toLowerCase();
    let useCases = getUseCases();
    if (department) useCases = useCases.filter((item) => item.department === department);
    if (query) {
      const tokens = query.split(/\s+/).filter(Boolean);
      useCases = useCases
        .map((item) => {
          const haystack = [item.title, item.subtitle, item.persona, item.layer, item.triggerType, ...(item.systems || []), ...(item.statusQuo || []), ...(item.agentification || [])].join(" ").toLowerCase();
          const score = tokens.reduce((total, token) => total + (haystack.includes(token) ? 1 : 0) + (item.title.toLowerCase().includes(token) ? 2 : 0), 0);
          return { item, score };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
        .map((entry) => entry.item);
    }
    return c.json({ useCases: useCases.slice(0, 80) });
  });
  apiApp.get("/api/agents", async (c) => c.json({ agents: await detectAgents() }));

  apiApp.route("/", createCatalogRoutes({ REPO_ROOT, DATA_ROOT }));
  apiApp.route("/", createWorkspaceRoutes({
    PROJECTS_ROOT,
    PROJECT_STORE,
    DATA_ROOT,
    REPO_ROOT,
    previews,
    ensureProjectInDb,
    appendActivity,
    wakeProjectAgent,
    runWorkspaceCommand,
    terminateChild,
    createPromotionPacket,
    repairWorkspaceArtifact,
    writeDeployPlanArtifact,
    writePublishPlanArtifact,
    getRegistrationStatus,
    ensureWorkspaceAgentRecord,
    persistWorkspaceStage,
    uniqueAgentDirName,
  }));
  apiApp.route("/", createRunRoutes({ runs, terminateChild }));
  apiApp.route("/", createAdkRoutes({
    previews,
    startAdkPreview,
    waitForPreviewRunning,
    serializePreview,
    refreshPreviewStatus,
    runAdkAgent,
    terminateChild,
  }));
  // Distinguish "no converted route matched this path" (→ fall through to the
  // legacy handler) from "a converted route matched and legitimately
  // responded 404" (e.g. { error: "workspace not found" }) — both are status
  // 404, but only the former should fall through. Hono's own notFound
  // handler only fires in the first case, so mark it with a sentinel header
  // the bridge below can check without inspecting the body.
  const NO_ROUTE_MATCHED = "x-ge-no-route-matched";
  apiApp.notFound((c) => {
    c.header(NO_ROUTE_MATCHED, "1");
    return c.json({ error: "not found" }, 404);
  });

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    try {
      // Hono first. A 404 with the NO_ROUTE_MATCHED sentinel means no
      // converted route matched this path/method → fall through to the
      // legacy raw-http handler below (which still owns SSE/streaming and
      // upstream-proxying routes that are too risky to strangle in this
      // pass). A 404 WITHOUT the sentinel means a converted route matched
      // and legitimately returned 404 itself — that response must be
      // returned as-is, not treated as a fallthrough signal.
      {
        const isBodyless = req.method === "GET" || req.method === "HEAD";
        const honoReq = new Request(`http://localhost${req.url}`, {
          method: req.method,
          headers: req.headers,
          body: isBodyless ? undefined : req,
          duplex: isBodyless ? undefined : "half",
        });
        const honoResp = await apiApp.fetch(honoReq);
        if (!(honoResp.status === 404 && honoResp.headers.has(NO_ROUTE_MATCHED))) {
          res.writeHead(honoResp.status, Object.fromEntries(honoResp.headers));
          res.end(Buffer.from(await honoResp.arrayBuffer()));
          return;
        }
      }
      // NOTE: /api/health, /api/daemon/status, auth/*, /api/systems,
      // /api/departments, /api/domains, /api/use-cases, /api/agents,
      // /api/runtime/*, the full /api/workspaces/* CRUD/tasks/secrets/
      // wakeups/files/terminal surface, AND the ADK preview lifecycle +
      // one-shot adk-run routes now live in the Hono apiApp above (server.js
      // apiApp.route() + apps/factory/src/routes/{catalog,workspaces,adk}.mjs).
      //
      // Only genuinely-streaming routes remain on this raw-http handler, each
      // with the SAME concrete blocker: the Hono→raw bridge above buffers a
      // converted response in full (await honoResp.arrayBuffer()) before
      // writing it, so a route that must stream over a long-lived connection
      // (SSE, upstream proxy pass-through) can't be expressed through it yet.
      // Converting them needs the bridge itself to stream Hono ReadableStream
      // bodies instead of buffering — a separate change to the bridge, not the
      // routes. The remaining branches are: adk-proxy (upstream ADK-web
      // proxy + SSE pass-through), /api/chat (agent-run SSE), and
      // /api/runs/:id/events (run-event SSE), plus the static-file fallback
      // (the intentional final GET catch-all, not a pending conversion).
      const adkProxyMatch = url.pathname.match(/^\/api\/workspaces\/([^/]+)\/adk-proxy(\/.*)?$/);
      if (adkProxyMatch) {
        const proxyProjectId = decodeURIComponent(adkProxyMatch[1]);
        const preview = await waitForPreviewRunning(previews.get(proxyProjectId), { timeoutMs: 10_000, intervalMs: 250 });
        if (!preview || preview.status !== "running") {
          return json(res, 503, { error: "ADK preview not running" });
        }
        let targetPath = adkProxyMatch[2] || "/";
        if (targetPath.startsWith("/dev/build_graph_image/")) {
          targetPath = targetPath.replace("/dev/build_graph_image/", "/dev/build_graph/");
        }
        const targetUrl = `${preview.url}${targetPath}${url.search || ""}`;
        try {
          const headers = { ...req.headers };
          delete headers.host;
          delete headers.connection;
          delete headers["content-length"];
          delete headers.origin;
          const upstream = await fetch(targetUrl, {
            method: req.method,
            headers,
            body: req.method === "GET" || req.method === "HEAD" ? undefined : req,
            duplex: req.method === "GET" || req.method === "HEAD" ? undefined : "half",
          });
          const hdrs = {};
          upstream.headers.forEach((v, k) => { hdrs[k] = v; });
          delete hdrs["x-frame-options"];
          hdrs["content-security-policy"] = "frame-ancestors 'self'";
          hdrs["cache-control"] = "no-store";
          const contentType = upstream.headers.get("content-type") || "";
          if (contentType.includes("text/html")) {
            let html = await upstream.text();
            const prefix = `/api/workspaces/${encodeURIComponent(proxyProjectId)}/adk-proxy`;
            const requestShim = `<script>
(() => {
  const prefix = ${JSON.stringify(prefix)};
  const shouldProxy = (value) => typeof value === "string"
    && value.startsWith("/")
    && !value.startsWith("//")
    && !value.startsWith(prefix)
    && (value === "/list-apps" || value === "/run_sse" || value.startsWith("/apps/") || value.startsWith("/dev/"));
  const mapUrl = (value) => {
    if (!shouldProxy(value)) return value;
    const mapped = value.startsWith("/dev/build_graph_image/")
      ? value.replace("/dev/build_graph_image/", "/dev/build_graph/")
      : value;
    return prefix + mapped;
  };
  const originalFetch = window.fetch;
  window.fetch = (input, init) => {
    if (typeof input === "string") return originalFetch(mapUrl(input), init);
    if (input instanceof Request) {
      const url = new URL(input.url, window.location.href);
      if (shouldProxy(url.pathname)) return originalFetch(new Request(mapUrl(url.pathname + url.search), input), init);
    }
    return originalFetch(input, init);
  };
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    return originalOpen.call(this, method, typeof url === "string" ? mapUrl(url) : url, ...rest);
  };
})();
</script>`;
            html = html
              .replace(/(src|href|action)=(["'])\/(?!\/)/g, `$1=$2${prefix}/`)
              .replace(/url\(\s*(['"]?)\/(?!\/)/g, `url($1${prefix}/`);
            html = html.includes("</head>")
              ? html.replace("</head>", `${requestShim}</head>`)
              : `${requestShim}${html}`;
            hdrs["content-length"] = Buffer.byteLength(html);
            res.writeHead(upstream.status, hdrs);
            res.end(html);
            return;
          }
          res.writeHead(upstream.status, hdrs);
          if (!upstream.body) { res.end(); return; }
          const reader = upstream.body.getReader();
          const pump = async () => {
            while (true) {
              const { done, value } = await reader.read();
              if (done) { res.end(); return; }
              res.write(value);
            }
          };
          await pump();
        } catch (e) {
          if (res.headersSent || res.writableEnded) {
            if (!res.writableEnded) res.destroy(e instanceof Error ? e : undefined);
            return;
          }
          return json(res, 502, { error: e.message || "proxy failed" });
        }
        return;
      }
      if (req.method === "POST" && url.pathname === "/api/chat") {
        const body = await readBody(req);
        await startAgentRun(body, res, req);
        return;
      }
      // NOTE: GET /api/runs, GET /api/runs/:id, GET /api/runs/:id/wait, and
      // POST /api/runs/:id/cancel now live in routes/runs.mjs. Only
      // GET /api/runs/:id/events (SSE, long-lived) stays here — it hands the
      // raw res to runs.stream(), which registers req.on("close") and pushes
      // further events onto it from a shared client registry.
      const runEventsMatch = url.pathname.match(/^\/api\/runs\/([^/]+)\/events$/);
      if (req.method === "GET" && runEventsMatch) {
        const run = runs.get(runEventsMatch[1]);
        if (!run) return json(res, 404, { error: "run not found" });
        return streamRun(req, res, run);
      }
      if (req.method === "GET" && serveWeb) return serveStatic(req, res, url.pathname);
      json(res, 404, { error: "not found" });
    } catch (error) {
      if (!res.headersSent && !res.writableEnded) {
        json(res, 500, { error: error instanceof Error ? error.message : String(error) });
        return;
      }
      if (!res.writableEnded) res.destroy(error instanceof Error ? error : undefined);
    }
  });

  await new Promise((resolveListen) => server.listen(port, host, resolveListen));
  const address = server.address();
  const actualPort = typeof address === "object" && address ? address.port : port;
  const url = `http://${host}:${actualPort}`;
  if (returnServer) return { server, url };
  return url;
}
