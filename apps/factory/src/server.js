import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { createServer as createNetServer } from "node:net";
import { chmodSync, cpSync, createWriteStream, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { delimiter, extname, join, resolve } from "node:path";
import { Hono } from "hono";
import { readDotEnv } from "./dotenv.mjs";
import { detectAgents, getAgentDef } from "./agents.js";
import { DEPARTMENTS, INTERVIEW_QUESTIONS } from "./departments.js";
import { DOMAIN_CATALOG, DOMAIN_SUMMARY, getDomainsByDepartment, searchDomains } from "./domains.generated.js";
import { MOCK_SYSTEMS, renderSystemPrompt } from "./systems.js";
import { readJson, writeJson } from "../../../tools/lib/json-io.mjs";
import { getUseCases } from "./use-cases.js";
import {
  createProject,
  ensureDefaultProject,
  ensureProjectDir,
  getProject,
  listProjectFiles,
  listProjects,
  projectRunsDir,
  readProjectFile,
  removeProject,
  touchProject,
  workspaceManifestPath,
} from "./projects.js";
import { createOutputParser, detectFormat } from "./output-parsers.js";
import { buildHandoffPacket, buildHarnessRunPlan, PERMISSION_PROFILES } from "./harness-runtime.js";
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
import { getAuthStatus, listGeminiEnterpriseApps, listProjects as listGcpProjects, setProject as setGcpProject, getFullSetupStatus, writeEnvFile } from "./auth.js";
import {
  openDatabase,
  getProjectDb, insertProjectDb, touchProjectDb, deleteProjectDb,
  listConversationsDb, createConversationDb, deleteConversationDb, renameConversationDb,
  listMessagesDb, appendMessageDb,
  listVersionsDb, createVersionDb, getVersionDb, promoteVersionDb,
  listAgentsDb, getAgentDb, insertAgentDb, updateAgentStageDb, updateAgentDb, deleteAgentDb,
  listArtifactsDb, STAGES,
  listTasksDb, getTaskDb, insertTaskDb, updateTaskDb, deleteTaskDb,
  appendActivityEventDb, listActivityEventsDb,
  getHeartbeatPolicyDb, upsertHeartbeatPolicyDb,
} from "./db.js";
import {
  saveBrief,
  readBrief,
} from "./versions.js";
import {
  createWorkspaceSnapshot,
  normalizeAgentDirName,
  restoreWorkspaceSnapshot,
} from "./snapshots.js";
import { createRunService } from "./run-service.js";
import { deleteSecret, listSecrets, readSecretsEnv, upsertSecret } from "./secrets.js";
import {
  APP_ROOT,
  GENERATOR_DATA_ROOT,
  GENERATOR_UV_CACHE,
  GENERATOR_WORKSPACES_ROOT,
  GENERATOR_WORKSPACE_STORE,
} from "./state-paths.js";

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
      recordRunArtifacts(dir, run.id, run.agentId || null, run.projectId).catch(() => {});
    }
  },
});

function appendActivity(type, { projectId = null, actor = "daemon", entityType = null, entityId = null, payload = {} } = {}) {
  try {
    return appendActivityEventDb({ projectId, actor, type, entityType, entityId, payload });
  } catch {
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

function materializeWorkspaceCommandShims(workspaceDir) {
  const binDir = join(workspaceDir, ".ge-harness", "bin");
  mkdirSync(binDir, { recursive: true });
  const script = `#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const args = process.argv.slice(2);
const cmd = args[0] || "status";

// readJson/writeJson come from the shared atomic json-io helper (imported above).

function status() {
  const manifest = readJson(join(cwd, "workspace.json"), {});
  const fixtures = readJson(join(cwd, "fixtures", "manifest.json"), {});
  const pipeline = readJson(join(cwd, "mock_systems", "pipeline.json"), null);
  const tables = Array.isArray(fixtures.tables) ? fixtures.tables : [];
  console.log(JSON.stringify({
    ok: true,
    workspace: manifest.id || cwd,
    capabilities: manifest.capabilities || [],
    readiness: manifest.readiness || {},
    nextAction: manifest.nextAction || (manifest.nextActions || [])[0] || null,
    fixtures: {
      tables: tables.length,
      totalRows: tables.reduce((total, table) => total + Number(table.rowCount || table.rows || 0), 0),
    },
    pipeline: pipeline && pipeline.pipeline ? pipeline.pipeline : undefined,
  }, null, 2));
}

function validate() {
  const checks = [];
  const has = (path, label) => {
    const ok = existsSync(join(cwd, path));
    checks.push({ id: label, ok, path });
    return ok;
  };
  has("pyproject.toml", "pyproject");
  has("app/agent.py", "agent");
  has("app/tools.py", "tools");
  has("fixtures/manifest.json", "fixtures");
  has("tests", "tests");
  let testExitCode = null;
  if (existsSync(join(cwd, "pyproject.toml")) && existsSync(join(cwd, "tests"))) {
    const env = { ...process.env, PYTHONPATH: [cwd, process.env.PYTHONPATH].filter(Boolean).join(":") };
    const command = existsSync(join(cwd, ".venv")) ? ["uv", ["run", "pytest"]] : ["python3", ["-m", "pytest"]];
    let result = spawnSync(command[0], command[1], { cwd, stdio: "inherit", env });
    if ((result.error || result.status === 127) && command[0] !== "uv") {
      result = spawnSync("uv", ["run", "pytest"], { cwd, stdio: "inherit", env });
    }
    testExitCode = result.status == null ? 1 : result.status;
  }
  const ok = checks.every((check) => check.ok) && (testExitCode == null || testExitCode === 0);
  mkdirSync(join(cwd, "artifacts"), { recursive: true });
  const report = { ok, checks, testExitCode, generatedAt: new Date().toISOString() };
  writeJson(join(cwd, "artifacts", "validation-report.json"), report);
  const pipelinePath = join(cwd, "mock_systems", "pipeline.json");
  const pipeline = readJson(pipelinePath, { steps: {} });
  pipeline.steps = pipeline.steps || {};
  pipeline.steps.test = {
    ...(pipeline.steps.test || {}),
    status: ok ? "done" : "failed",
    exitCode: testExitCode,
    completedAt: report.generatedAt,
  };
  writeJson(pipelinePath, pipeline);
  const manifestPath = join(cwd, "workspace.json");
  const manifest = readJson(manifestPath, {});
  if (manifest && Object.keys(manifest).length) {
    manifest.readiness = manifest.readiness || {};
    manifest.readiness.tests = {
      status: ok ? "passing" : "failing",
      lastExitCode: testExitCode,
      output: "tests/test_smoke.py",
    };
    manifest.capabilities = Array.from(new Set([...(manifest.capabilities || []), ...(ok ? ["smoke_tests"] : [])]));
    manifest.nextActions = ok ? ["preview"] : ["validate"];
    manifest.nextAction = manifest.nextActions[0];
    manifest.updatedAt = report.generatedAt;
    writeJson(manifestPath, manifest);
  }
  console.log(JSON.stringify(report, null, 2));
  process.exit(ok ? 0 : 1);
}

if (cmd === "validate") validate();
else status();
`;
  for (const name of ["ge", "factory"]) {
    const target = join(binDir, name);
    writeFileSync(target, script, "utf8");
    chmodSync(target, 0o755);
  }
  return binDir;
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

  const promptParts = [
    "# Instructions",
    renderSystemPrompt(),
    "",
    `Project: ${project.name} (${project.id})`,
    `Workspace: ${cwd}`,
    `Repository root: ${REPO_ROOT}`,
  ];
  if (agentRecord) {
    promptParts.push(
      "",
      `# Active Agent`,
      `Agent: ${agentRecord.name} (${agentRecord.id})`,
      `Directory: ${run.agentDirName ? `${run.agentDirName}/` : "./ (workspace root)"}`,
      `Stage: ${agentRecord.stage}`,
      agentRecord.useCaseId ? `Use Case: ${agentRecord.useCaseId}` : "",
      agentRecord.departmentId ? `Department: ${agentRecord.departmentId}` : "",
      "",
      `Write all generated files inside ${cwd}. This is the agent's isolated working directory.`,
      "Workspace-local commands are on PATH: `ge validate`, `ge status`, `factory status`. Do not change directory to the repository root from this sandboxed run.",
    );
  } else {
    promptParts.push("", "Write files for this task inside the workspace unless the user explicitly asks to change the harness repo itself.", "Workspace-local commands are on PATH: `ge validate`, `ge status`, `factory status`.");
  }
  if (payload.task && typeof payload.task === "object") {
    promptParts.push(
      "",
      "# Assigned Task",
      `Task ID: ${payload.task.id}`,
      `Title: ${payload.task.title}`,
      payload.task.goal ? `Goal: ${payload.task.goal}` : "",
      payload.task.priority ? `Priority: ${payload.task.priority}` : "",
      payload.task.description ? `Description:\n${payload.task.description}` : "",
    );
  }
  promptParts.push(
    "",
    buildHandoffPacket({
      receiver: plan.adapterId,
      run,
      project,
      cwd,
      repoRoot: REPO_ROOT,
      userRequest: message,
      task: payload.task,
      plan,
    }),
  );
  const prompt = promptParts.filter(Boolean).join("\n");
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

  const args = def.buildArgs(prompt, { cwd, model: payload.model || "default", permissionProfile: plan.permissionProfile.id });
  const child = spawn(def.resolvedBin, args, {
    cwd,
    env: buildWorkspaceEnv({
      GE_HARNESS_DAEMON_URL: payload.daemonUrl || "",
      GE_HARNESS_RUN_ID: run.id,
      GE_HARNESS_PROJECT_ID: project.id,
      GE_HARNESS_WORKSPACE: cwd,
      GE_HARNESS_BIN: workspaceBin,
      GE_HARNESS_REPO_ROOT: REPO_ROOT,
      ...secretEnv,
    }, cwd),
    stdio: ["pipe", "pipe", "pipe"],
  });
  run.child = child;
  emit(run, "plan", {
    adapterId: plan.adapterId,
    adapterName: plan.adapterName,
    requestedAgentId,
    fallbackFrom: plan.fallbackFrom,
    selectionReason: plan.selectionReason,
    permissionProfile: plan.permissionProfile.id,
    requestedCapabilities: plan.requestedCapabilities,
    skills: plan.skills.map((skill) => ({ id: skill.id, path: skill.relativePath, workspacePath: skill.workspaceRelativePath, capability: skill.capability })),
    ownedPaths: plan.ownedPaths,
    avoidPaths: plan.avoidPaths,
  });
  emit(run, "status", { label: "spawned", agentId: def.id, pid: child.pid });
  appendActivity("run.started", {
    projectId: project.id,
    entityType: "run",
    entityId: run.id,
    payload: {
      agentId: def.id,
      requestedAgentId,
      permissionProfile: plan.permissionProfile.id,
      requestedCapabilities: plan.requestedCapabilities,
      skills: plan.skills.map((skill) => ({ id: skill.id, path: skill.relativePath, workspacePath: skill.workspaceRelativePath, capability: skill.capability })),
      fallbackFrom: plan.fallbackFrom,
      selectedAgentId: agentRecord?.id || null,
      taskId: payload.task?.id || payload.taskId || null,
      wakeupReason: run.wakeupReason,
      secretNames: Object.keys(secretEnv),
    },
  });

  const timeoutSec = Number(payload.timeoutSec || heartbeatPolicy?.timeoutSec || 0);
  const graceSec = Number(payload.graceSec ?? heartbeatPolicy?.graceSec ?? 10);
  let forceTimer = null;
  const timeoutTimer = timeoutSec > 0 ? setTimeout(() => {
    emit(run, "error", { code: "RUN_TIMEOUT", message: `run exceeded ${timeoutSec}s timeout` });
    terminateChild(child, "SIGTERM");
    if (graceSec >= 0) {
      forceTimer = setTimeout(() => terminateChild(child, "SIGKILL"), graceSec * 1000);
      forceTimer.unref?.();
    }
  }, timeoutSec * 1000) : null;
  timeoutTimer?.unref?.();

  if (def.promptViaStdin) {
    child.stdin.end(prompt);
  }

  const outputFormat = def.streamFormat === "json-lines" ? detectFormat(def.id) : "plain";
  const parser = createOutputParser(outputFormat);

  child.stdout.on("data", (chunk) => {
    const events = parser.feed(chunk.toString("utf8"));
    for (const ev of events) {
      if (ev.kind === "text") emit(run, "agent", { type: "text_delta", delta: ev.text });
      else if (ev.kind === "thinking") emit(run, "agent", { type: "thinking", delta: ev.text });
      else if (ev.kind === "tool_use") emit(run, "agent", { type: "tool_use", eventType: "tool_call_made", name: ev.name, id: ev.id, raw: ev });
      else if (ev.kind === "tool_result") emit(run, "agent", { type: "tool_result", eventType: "tool_call_result", toolUseId: ev.toolUseId, delta: ev.content, isError: ev.isError });
      else if (ev.kind === "error") emit(run, "agent", { type: "stderr", delta: ev.text || "" });
      else if (ev.kind === "status") emit(run, "status", { label: ev.label, runId: run.id });
      else if (ev.kind === "usage") emit(run, "agent", { type: "usage", inputTokens: ev.inputTokens, outputTokens: ev.outputTokens, costUsd: ev.costUsd });
      else if (ev.kind === "raw") emit(run, "agent", { type: "json_event", raw: ev.raw, delta: JSON.stringify(ev.raw) });
    }
  });
  child.stderr.on("data", (chunk) => {
    emit(run, "agent", { type: "stderr", delta: chunk.toString("utf8") });
  });
  child.on("error", (error) => {
    if (timeoutTimer) clearTimeout(timeoutTimer);
    if (forceTimer) clearTimeout(forceTimer);
    emit(run, "error", { code: "SPAWN_FAILED", message: error.message });
    finish(run, "failed", 1);
  });
  child.on("close", (code, signal) => {
    if (timeoutTimer) clearTimeout(timeoutTimer);
    if (forceTimer) clearTimeout(forceTimer);
    for (const ev of parser.flush()) {
      if (ev.kind === "text") emit(run, "agent", { type: "text_delta", delta: ev.text });
      else emit(run, "agent", { type: "json_event", raw: ev.raw || ev, delta: ev.text || "" });
    }
    if (run.cancelRequested) {
      finish(run, "canceled", code, signal || "SIGTERM");
      return;
    }
    const timedOut = run.events.some((event) => event.event === "error" && event.data?.code === "RUN_TIMEOUT");
    finish(run, timedOut ? "failed" : code === 0 ? "succeeded" : "failed", code, signal);
  });
  return run;
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

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const workspacePathname = url.pathname;
    try {
      // Hono first (GET only). A 404 means no converted route matched → fall through.
      if (req.method === "GET") {
        const honoResp = await apiApp.fetch(new Request(`http://localhost${req.url}`, { method: "GET" }));
        if (honoResp.status !== 404) {
          res.writeHead(honoResp.status, Object.fromEntries(honoResp.headers));
          res.end(await honoResp.text());
          return;
        }
      }
      if (req.method === "GET" && url.pathname === "/api/health") return json(res, 200, { ok: true, systems: MOCK_SYSTEMS.length });
      if (req.method === "GET" && url.pathname === "/api/daemon/status") return json(res, 200, daemonStatus());

      // ── Auth & Setup endpoints ──
      if (req.method === "GET" && url.pathname === "/api/auth/status") {
        return json(res, 200, await getFullSetupStatus(DATA_ROOT));
      }
      if (req.method === "GET" && url.pathname === "/api/auth/projects") {
        return json(res, 200, { projects: await listGcpProjects() });
      }
      if (req.method === "POST" && url.pathname === "/api/auth/project") {
        const body = await readBody(req);
        const ok = await setGcpProject(body.projectId);
        if (ok) await writeEnvFile(DATA_ROOT, { GOOGLE_CLOUD_PROJECT: body.projectId });
        return json(res, 200, { ok, projectId: body.projectId });
      }
      if (req.method === "GET" && url.pathname === "/api/auth/gemini-apps") {
        const projectId = url.searchParams.get("project") || (await getAuthStatus()).project;
        return json(res, 200, { apps: await listGeminiEnterpriseApps(projectId) });
      }
      if (req.method === "POST" && url.pathname === "/api/auth/env") {
        const body = await readBody(req);
        const merged = await writeEnvFile(DATA_ROOT, body);
        return json(res, 200, { ok: true, env: merged });
      }

      if (req.method === "GET" && url.pathname === "/api/systems") return json(res, 200, { systems: MOCK_SYSTEMS });
      if (req.method === "GET" && url.pathname === "/api/departments") {
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
        return json(res, 200, { departments, interviewQuestions: INTERVIEW_QUESTIONS });
      }
      if (req.method === "GET" && url.pathname === "/api/domains") {
        const dept = url.searchParams.get("department");
        const q = url.searchParams.get("q");
        let domains = dept ? getDomainsByDepartment(dept) : DOMAIN_CATALOG;
        if (q) domains = searchDomains(q).filter((d) => !dept || d.department === dept);
        return json(res, 200, { domains, summary: DOMAIN_SUMMARY, total: domains.length });
      }
      if (req.method === "GET" && url.pathname === "/api/use-cases") {
        const department = url.searchParams.get("department");
        const query = (url.searchParams.get("q") || "").toLowerCase();
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
        return json(res, 200, { useCases: useCases.slice(0, 80) });
      }
      if (req.method === "GET" && url.pathname === "/api/agents") return json(res, 200, { agents: await detectAgents() });
      if (req.method === "GET" && url.pathname === "/api/runtime/adapters") {
        const agents = await detectAgents();
        return json(res, 200, { adapters: agents.map((agent) => agent.contract) });
      }
      if (req.method === "GET" && url.pathname === "/api/runtime/capabilities") {
        const agents = await detectAgents();
        return json(res, 200, {
          permissionProfiles: Object.values(PERMISSION_PROFILES),
          adapters: agents.map((agent) => ({
            id: agent.id,
            name: agent.name,
            available: agent.available,
            capabilities: agent.capabilities,
            contract: agent.contract,
          })),
        });
      }
      if (req.method === "GET" && url.pathname === "/api/runtime/skills") {
        return json(res, 200, await loadSkillRegistry(REPO_ROOT));
      }
      if (req.method === "GET" && workspacePathname === "/api/workspaces") {
        const workspaces = await listProjects({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT });
        return json(res, 200, { workspaces });
      }
      if (req.method === "POST" && workspacePathname === "/api/workspaces") {
        const body = await readBody(req);
        const workspace = await createProject({
          storePath: PROJECT_STORE,
          projectsRoot: PROJECTS_ROOT,
          name: typeof body.name === "string" ? body.name : "New Workspace",
          kind: typeof body.kind === "string" ? body.kind : "workspace",
          useCaseId: body.useCaseId || undefined,
          departmentId: body.departmentId || undefined,
        });
        ensureProjectInDb(workspace.id);
        appendActivity("workspace.created", {
          projectId: workspace.id,
          entityType: "workspace",
          entityId: workspace.id,
          payload: { name: workspace.name, kind: workspace.kind },
        });
        return json(res, 200, { workspace });
      }
      const projectActivityMatch = workspacePathname.match(/^\/api\/workspaces\/([^/]+)\/activity$/);
      if (req.method === "GET" && projectActivityMatch) {
        const pid = decodeURIComponent(projectActivityMatch[1]);
        return json(res, 200, { events: listActivityEventsDb({ projectId: pid, limit: url.searchParams.get("limit") }) });
      }
      const projectTasksMatch = workspacePathname.match(/^\/api\/workspaces\/([^/]+)\/tasks(?:\/([^/]+))?$/);
      if (projectTasksMatch) {
        const pid = decodeURIComponent(projectTasksMatch[1]);
        const taskId = projectTasksMatch[2] ? decodeURIComponent(projectTasksMatch[2]) : null;
        const project = await getProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId: pid });
        if (!project) return json(res, 404, { error: "workspace not found" });
        ensureProjectInDb(pid);
        if (req.method === "GET" && !taskId) {
          return json(res, 200, { tasks: listTasksDb(pid, { status: url.searchParams.get("status"), assigneeAgentId: url.searchParams.get("assigneeAgentId") }) });
        }
        if (req.method === "POST" && !taskId) {
          const body = await readBody(req);
          const task = insertTaskDb(pid, body);
          appendActivity("task.created", { projectId: pid, entityType: "task", entityId: task.id, payload: { title: task.title, assigneeAgentId: task.assigneeAgentId } });
          if (task.assigneeAgentId) {
            const policy = getHeartbeatPolicyDb(task.assigneeAgentId);
            if (policy.wakeOnAssignment) {
              wakeProjectAgent(pid, {
                agentId: body.runtimeAgentId || "gemini",
                selectedAgentId: task.assigneeAgentId,
                reason: "assignment",
                taskId: task.id,
              }).catch((error) => appendActivity("wakeup.failed", { projectId: pid, entityType: "task", entityId: task.id, payload: { error: error.message } }));
            }
          }
          return json(res, 201, { task });
        }
        if (req.method === "GET" && taskId) {
          const task = getTaskDb(pid, taskId);
          if (!task) return json(res, 404, { error: "task not found" });
          return json(res, 200, { task });
        }
        if (req.method === "PATCH" && taskId) {
          const body = await readBody(req);
          const task = updateTaskDb(pid, taskId, body);
          if (!task) return json(res, 404, { error: "task not found" });
          appendActivity("task.updated", { projectId: pid, entityType: "task", entityId: task.id, payload: body });
          return json(res, 200, { task });
        }
        if (req.method === "DELETE" && taskId) {
          deleteTaskDb(pid, taskId);
          appendActivity("task.deleted", { projectId: pid, entityType: "task", entityId: taskId });
          return json(res, 200, { ok: true });
        }
      }
      const projectSecretsMatch = workspacePathname.match(/^\/api\/workspaces\/([^/]+)\/secrets(?:\/([^/]+))?$/);
      if (projectSecretsMatch) {
        const pid = decodeURIComponent(projectSecretsMatch[1]);
        const name = projectSecretsMatch[2] ? decodeURIComponent(projectSecretsMatch[2]) : null;
        const project = await getProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId: pid });
        if (!project) return json(res, 404, { error: "workspace not found" });
        if (req.method === "GET" && !name) return json(res, 200, { secrets: await listSecrets(DATA_ROOT) });
        if (req.method === "POST" && !name) {
          const body = await readBody(req);
          const secret = await upsertSecret(DATA_ROOT, body);
          appendActivity("secret.upserted", { projectId: pid, entityType: "secret", entityId: secret.name, payload: { name: secret.name, scope: secret.scope } });
          return json(res, 201, { secret });
        }
        if (req.method === "DELETE" && name) {
          await deleteSecret(DATA_ROOT, name);
          appendActivity("secret.deleted", { projectId: pid, entityType: "secret", entityId: name });
          return json(res, 200, { ok: true });
        }
      }
      const projectWakeupMatch = workspacePathname.match(/^\/api\/workspaces\/([^/]+)\/wakeups$/);
      if (req.method === "POST" && projectWakeupMatch) {
        const pid = decodeURIComponent(projectWakeupMatch[1]);
        const body = await readBody(req);
        const project = await getProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId: pid });
        if (!project) return json(res, 404, { error: "workspace not found" });
        try {
          return json(res, 202, await wakeProjectAgent(pid, body));
        } catch (error) {
          return json(res, 400, { error: error instanceof Error ? error.message : String(error) });
        }
      }
      const projectDeleteMatch = workspacePathname.match(/^\/api\/workspaces\/([^/]+)$/);
      if (req.method === "DELETE" && projectDeleteMatch) {
        const pid = decodeURIComponent(projectDeleteMatch[1]);
        // Stop any running ADK preview for this project
        const preview = previews.get(pid);
        terminateChild(preview?.child, "SIGTERM");
        previews.delete(pid);
        // Delete from SQLite (explicit + CASCADE)
        try { deleteProjectDb(pid); } catch { /* may not exist in db */ }
        // Delete from the workspace store and remove the workspace directory from disk.
        await removeProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT, projectId: pid });
        appendActivity("workspace.deleted", { projectId: pid, entityType: "workspace", entityId: pid });
        return json(res, 200, { ok: true, deleted: pid });
      }
      const projectFilesMatch = workspacePathname.match(/^\/api\/workspaces\/([^/]+)\/files$/);
      if (req.method === "GET" && projectFilesMatch) {
        return json(res, 200, { files: await listProjectFiles(PROJECTS_ROOT, projectFilesMatch[1]) });
      }
      const projectFileContentMatch = workspacePathname.match(/^\/api\/workspaces\/([^/]+)\/file$/);
      if (req.method === "GET" && projectFileContentMatch) {
        return json(res, 200, { file: await readProjectFile(PROJECTS_ROOT, projectFileContentMatch[1], url.searchParams.get("path")) });
      }
      const projectCommandMatch = workspacePathname.match(/^\/api\/workspaces\/([^/]+)\/terminal$/);
      if (req.method === "POST" && projectCommandMatch) {
        const body = await readBody(req);
        return json(res, 200, { result: await runWorkspaceCommand(projectCommandMatch[1], body.commandId) });
      }
      const projectPreviewMatch = workspacePathname.match(/^\/api\/workspaces\/([^/]+)\/previews\/adk-web$/);
      if (projectPreviewMatch) {
        if (req.method === "POST") return json(res, 200, { preview: serializePreview(await waitForPreviewRunning(await startAdkPreview(projectPreviewMatch[1]))) });
        if (req.method === "GET") return json(res, 200, { preview: serializePreview(await refreshPreviewStatus(previews.get(projectPreviewMatch[1]))) });
        if (req.method === "DELETE") {
          const preview = previews.get(projectPreviewMatch[1]);
          terminateChild(preview?.child, "SIGTERM");
          return json(res, 200, { ok: true });
        }
      }
      const adkRunMatch = workspacePathname.match(/^\/api\/workspaces\/([^/]+)\/adk-run$/);
      if (adkRunMatch && req.method === "POST") {
        const body = await readBody(req);
        const result = await runAdkAgent(decodeURIComponent(adkRunMatch[1]), body.prompt || body.message || "hello");
        if (result.blocked) return json(res, 422, result);
        return json(res, 200, { result });
      }
      const promotionPacketMatch = url.pathname.match(/^\/api\/workspaces\/([^/]+)\/promotion-packet$/);
      if (promotionPacketMatch && (req.method === "POST" || req.method === "GET")) {
        const pid = decodeURIComponent(promotionPacketMatch[1]);
        const workspaceDir = await ensureProjectDir(PROJECTS_ROOT, pid);
        const manifestPath = join(workspaceDir, "workspace.json");
        const gate = await runWorkspaceDoctor({
          workspaceDir,
          manifestPath,
          workspaceId: pid,
          repoRoot: REPO_ROOT,
          stage: "promote",
        });
        if (!gate.ok) return json(res, 422, { ok: false, blocked: true, doctor: gate });
        const promotion = await createPromotionPacket({
          workspaceDir,
          manifestPath,
          projectId: pid,
          repoRoot: REPO_ROOT,
          source: req.method === "POST" ? "ui" : "api",
        });
        touchProjectDb(pid);
        return json(res, 200, promotion);
      }
      const workspaceDoctorMatch = url.pathname.match(/^\/api\/workspaces\/([^/]+)\/workspace-doctor$/);
      if (workspaceDoctorMatch && (req.method === "POST" || req.method === "GET")) {
        const pid = decodeURIComponent(workspaceDoctorMatch[1]);
        const workspaceDir = await ensureProjectDir(PROJECTS_ROOT, pid);
        const body = req.method === "POST" ? await readBody(req) : {};
        const stage = body.stage || url.searchParams.get("stage") || "validate";
        const report = await runWorkspaceDoctor({
          workspaceDir,
          manifestPath: join(workspaceDir, WORKSPACE_PATHS.workspaceManifest),
          workspaceId: pid,
          repoRoot: REPO_ROOT,
          stage,
        });
        return json(res, report.ok ? 200 : 422, report);
      }
      const workspaceRepairMatch = url.pathname.match(/^\/api\/workspaces\/([^/]+)\/workspace-repair$/);
      if (workspaceRepairMatch && req.method === "POST") {
        const pid = decodeURIComponent(workspaceRepairMatch[1]);
        const body = await readBody(req);
        const report = await repairWorkspaceArtifact(pid, {
          stage: body.stage || "preview",
          attempts: body.attempts || body.maxAttempts || 3,
          runPreview: body.runPreview !== false,
          target: body.target || "agent_runtime",
        });
        return json(res, report.ok ? 200 : 422, report);
      }
      const planMatch = url.pathname.match(/^\/api\/workspaces\/([^/]+)\/plans\/(deploy|publish)$/);
      if (planMatch && req.method === "POST") {
        const pid = decodeURIComponent(planMatch[1]);
        const kind = planMatch[2];
        const body = await readBody(req);
        const result = kind === "deploy"
          ? await writeDeployPlanArtifact(pid, body.target || "agent_runtime")
          : await writePublishPlanArtifact(pid, body.appId || body.app_id || "<GEMINI_ENTERPRISE_APP_ID>");
        if (result.blocked) return json(res, 422, result);
        return json(res, 200, result);
      }
      const registrationMatch = url.pathname.match(/^\/api\/workspaces\/([^/]+)\/registration$/);
      if (req.method === "GET" && registrationMatch) {
        return json(res, 200, { registration: await getRegistrationStatus(registrationMatch[1]) });
      }
      const agentsMatch = url.pathname.match(/^\/api\/workspaces\/([^/]+)\/agents(?:\/([^/]+))?(?:\/(stage|artifacts|heartbeat-policy))?$/);
      if (agentsMatch) {
        const pid = decodeURIComponent(agentsMatch[1]);
        const aid = agentsMatch[2] ? decodeURIComponent(agentsMatch[2]) : null;
        const sub = agentsMatch[3] || null;
        ensureProjectInDb(pid);
        if (req.method === "GET" && !aid) {
          return json(res, 200, { agents: ensureWorkspaceAgentRecord(pid), stages: STAGES });
        }
        if (req.method === "POST" && !aid) {
          const body = await readBody(req);
          const proposedDir = body.dirName || body.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "agent";
          let dirName;
          try {
            dirName = uniqueAgentDirName(pid, proposedDir);
          } catch {
            return json(res, 400, { error: "invalid agent directory" });
          }
          mkdirSync(join(await ensureProjectDir(PROJECTS_ROOT, pid), dirName), { recursive: true });
          const agent = insertAgentDb({ projectId: pid, name: body.name || "New Agent", useCaseId: body.useCaseId, departmentId: body.departmentId, dirName, brief: body.brief });
          if (body.heartbeatPolicy && typeof body.heartbeatPolicy === "object") upsertHeartbeatPolicyDb(agent.id, body.heartbeatPolicy);
          appendActivity("agent.created", { projectId: pid, entityType: "agent", entityId: agent.id, payload: { name: agent.name, dirName: agent.dirName } });
          return json(res, 201, { agent });
        }
        if (req.method === "GET" && aid && !sub) {
          const agent = getAgentDb(aid);
          if (!agent) return json(res, 404, { error: "agent not found" });
          return json(res, 200, { agent });
        }
        if (req.method === "PATCH" && aid && sub === "stage") {
          const body = await readBody(req);
          if (body.stage === "tested") {
            const workspaceDir = join(PROJECTS_ROOT, pid);
            const validation = await validateAgentWorkspace({
              workspaceDir,
              manifestPath: workspaceManifestPath(PROJECTS_ROOT, pid),
              workspaceId: pid,
              repoRoot: REPO_ROOT,
              testsRequested: false,
              source: "stage-patch",
            });
            if (!validation.ok) return json(res, 422, { error: "validation failed", validation });
          }
          const agent = updateAgentStageDb(aid, body.stage);
          persistWorkspaceStage(pid, body.stage, { source: "stage-patch" });
          appendActivity("agent.stage_changed", { projectId: pid, entityType: "agent", entityId: aid, payload: { stage: body.stage } });
          return json(res, 200, { agent });
        }
        if (aid && sub === "heartbeat-policy") {
          const agent = getAgentDb(aid);
          if (!agent) return json(res, 404, { error: "agent not found" });
          if (req.method === "GET") return json(res, 200, { policy: getHeartbeatPolicyDb(aid) });
          if (req.method === "PATCH") {
            const body = await readBody(req);
            const policy = upsertHeartbeatPolicyDb(aid, body);
            appendActivity("agent.heartbeat_policy_updated", { projectId: pid, entityType: "agent", entityId: aid, payload: policy });
            return json(res, 200, { policy });
          }
        }
        if (req.method === "PATCH" && aid && !sub) {
          const body = await readBody(req);
          updateAgentDb(aid, body);
          appendActivity("agent.updated", { projectId: pid, entityType: "agent", entityId: aid, payload: body });
          return json(res, 200, { agent: getAgentDb(aid) });
        }
        if (req.method === "DELETE" && aid) {
          deleteAgentDb(aid);
          appendActivity("agent.deleted", { projectId: pid, entityType: "agent", entityId: aid });
          return json(res, 200, { ok: true });
        }
        if (req.method === "GET" && aid && sub === "artifacts") {
          return json(res, 200, { artifacts: listArtifactsDb(aid) });
        }
      }
      const chatSessionsMatch = url.pathname.match(/^\/api\/workspaces\/([^/]+)\/chat\/sessions(?:\/([^/]+))?$/);
      if (chatSessionsMatch) {
        const pid = decodeURIComponent(chatSessionsMatch[1]);
        const sid = chatSessionsMatch[2] ? decodeURIComponent(chatSessionsMatch[2]) : null;
        ensureProjectInDb(pid);
        if (req.method === "GET" && !sid) {
          const agentId = url.searchParams.get("agentId") || null;
          const agent = agentId ? getAgentDb(agentId) : null;
          if (agentId && (!agent || agent.projectId !== pid)) return json(res, 404, { error: "Agent not found" });
          return json(res, 200, { sessions: listConversationsDb(pid, agentId) });
        }
        if (req.method === "POST" && !sid) {
          const body = await readBody(req);
          const agentId = typeof body.agentId === "string" && body.agentId ? body.agentId : null;
          const agent = agentId ? getAgentDb(agentId) : null;
          if (agentId && (!agent || agent.projectId !== pid)) return json(res, 404, { error: "Agent not found" });
          const session = createConversationDb(pid, body.title, agentId);
          return json(res, 201, { session });
        }
        if (req.method === "DELETE" && sid) {
          deleteConversationDb(pid, sid);
          return json(res, 200, { ok: true });
        }
        if (req.method === "PATCH" && sid) {
          const body = await readBody(req);
          const session = renameConversationDb(pid, sid, body.title);
          return json(res, 200, { session });
        }
      }
      const chatMessagesMatch = url.pathname.match(/^\/api\/workspaces\/([^/]+)\/chat\/sessions\/([^/]+)\/messages$/);
      if (chatMessagesMatch) {
        const pid = decodeURIComponent(chatMessagesMatch[1]);
        const sid = decodeURIComponent(chatMessagesMatch[2]);
        if (req.method === "GET") {
          return json(res, 200, { messages: listMessagesDb(pid, sid) });
        }
        if (req.method === "POST") {
          const body = await readBody(req);
          const message = appendMessageDb(pid, sid, body);
          return json(res, 201, { message });
        }
      }
      const briefMatch = url.pathname.match(/^\/api\/workspaces\/([^/]+)\/brief$/);
      if (briefMatch) {
        const pid = decodeURIComponent(briefMatch[1]);
        if (req.method === "POST") {
          const body = await readBody(req);
          const brief = await saveBrief(PROJECTS_ROOT, pid, body);
          return json(res, 201, { brief });
        }
        if (req.method === "GET") {
          const brief = await readBrief(PROJECTS_ROOT, pid);
          return json(res, 200, { brief });
        }
      }
      const versionsMatch = url.pathname.match(/^\/api\/workspaces\/([^/]+)\/versions(?:\/(\d+))?(?:\/(promote))?$/);
      if (versionsMatch) {
        const pid = decodeURIComponent(versionsMatch[1]);
        const vid = versionsMatch[2] ? Number(versionsMatch[2]) : null;
        const action = versionsMatch[3] || null;
        ensureProjectInDb(pid);
        if (req.method === "GET" && vid === null) {
          return json(res, 200, listVersionsDb(pid));
        }
        if (req.method === "POST" && vid === null) {
          const body = await readBody(req);
          const snapshot = await createWorkspaceSnapshot(PROJECTS_ROOT, pid, { message: `workspace version for ${pid}` });
          const version = createVersionDb(pid, {
            brief: body.brief || null,
            fileSnapshot: snapshot.fileSnapshot,
            snapshotRef: snapshot.commit,
          });
          touchProjectDb(pid);
          appendActivity("version.created", { projectId: pid, entityType: "version", entityId: String(version.version), payload: { snapshotRef: version.snapshotRef, fileCount: version.fileCount } });
          return json(res, 201, { version });
        }
        if (req.method === "GET" && vid !== null && !action) {
          const version = getVersionDb(pid, vid);
          if (!version) return json(res, 404, { error: "version not found" });
          return json(res, 200, { version });
        }
        if (req.method === "PATCH" && vid !== null && action === "promote") {
          const version = getVersionDb(pid, vid);
          if (!version) return json(res, 404, { error: "version not found" });
          if (!version.snapshotRef) return json(res, 409, { error: "version has no restorable snapshot" });
          await restoreWorkspaceSnapshot(PROJECTS_ROOT, pid, version.snapshotRef);
          const result = promoteVersionDb(pid, vid);
          appendActivity("version.promoted", { projectId: pid, entityType: "version", entityId: String(vid), payload: { snapshotRef: version.snapshotRef } });
          return json(res, 200, result);
        }
      }
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
      if (req.method === "GET" && url.pathname === "/api/runs") {
        const filters = {
          projectId: url.searchParams.get("projectId") || "",
          agentId: url.searchParams.get("agentId") || "",
          status: url.searchParams.get("status") || "",
        };
        return json(res, 200, { runs: runs.list(filters).map((run) => runs.statusBody(run)) });
      }
      const runMatch = url.pathname.match(/^\/api\/runs\/([^/]+)(?:\/(events|cancel|wait))?$/);
      if (runMatch) {
        const run = runs.get(runMatch[1]);
        if (!run) return json(res, 404, { error: "run not found" });
        if (req.method === "GET" && runMatch[2] === "events") return streamRun(req, res, run);
        if (req.method === "GET" && runMatch[2] === "wait") return json(res, 200, { run: await runs.wait(run) });
        if (req.method === "POST" && runMatch[2] === "cancel") {
          runs.cancel(run, terminateChild);
          return json(res, 200, { ok: true });
        }
        if (req.method === "GET" && !runMatch[2]) {
          return json(res, 200, { run: runs.statusBody(run) });
        }
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
