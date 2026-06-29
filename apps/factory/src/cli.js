#!/usr/bin/env node
import { spawn } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { runPreflight } from "./preflight.js";
import { loadSkillRegistry } from "./skill-registry.js";
import { scaffoldWithAgentsCli } from "./agents-cli-scaffold.js";
import {
  createProject,
  ensureDefaultProject,
  listProjects,
  projectDir,
  workspaceManifestPath,
} from "./projects.js";
import {
  updateWorkspaceCapabilities,
  writeJsonArtifact,
  writeMarkdownArtifact,
  workspaceHasLocalAgent,
} from "./workspace-capabilities.js";
import { validateAgentWorkspace } from "./agent-workspace-pipeline.js";
import { ARTIFACT_PATHS } from "./workspace-contract.js";
import { runWorkspaceDoctor } from "./workspace-doctor.js";
import { runWorkspaceRepair } from "./workspace-repair.js";
import { runAdkPreviewForWorkspace } from "./adk-preview.js";
import { createPromotionPacket } from "./promotion-packet.js";
import {
  buildDeployPlan,
  buildPublishPlan,
  renderPlanMarkdown,
} from "./deploy-plan.js";
import {
  APP_ROOT,
  GENERATOR_DATA_ROOT,
  GENERATOR_WORKSPACES_ROOT,
  GENERATOR_WORKSPACE_STORE,
  displayPath,
} from "./state-paths.js";
import {
  createFactoryPlan,
  runFactoryPlan,
} from "./factory.js";
import { runHarnessTask } from "./harness-runner.js";
import { buildControlPlanePlan } from "./factory-orchestration.js";
import {
  enqueueFactoryStage,
  patchFirestoreDocument,
  resolveServiceUrl,
} from "./factory-worker.js";

const REPO_ROOT = APP_ROOT;
const DATA_ROOT = GENERATOR_DATA_ROOT;
const PROJECTS_ROOT = GENERATOR_WORKSPACES_ROOT;
const PROJECT_STORE = GENERATOR_WORKSPACE_STORE;
const GE_MOCK = join(REPO_ROOT, "scripts", "factory.mjs");

const argv = process.argv.slice(2);
let port = Number(process.env.GE_HARNESS_PORT) || 17654;
let host = process.env.GE_HARNESS_HOST || "127.0.0.1";
let daemonUrl = process.env.GE_HARNESS_DAEMON_URL || "http://127.0.0.1:17654";
let open = true;
let explicitPort = Boolean(process.env.GE_HARNESS_PORT);
const positionals = [];
const flags = {};

for (let i = 0; i < argv.length; i += 1) {
  const arg = argv[i];
  if (arg === "--port" || arg === "-p") {
    port = Number(argv[++i]);
    explicitPort = true;
  }
  else if (arg === "--host") host = argv[++i];
  else if (arg === "--daemon-url") daemonUrl = argv[++i];
  else if (arg === "--no-open") open = false;
  else if (arg === "--help" || arg === "-h") {
    printHelp();
    process.exit(0);
  } else if (arg.startsWith("--")) {
    const key = arg.slice(2);
    flags[key] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
  } else {
    positionals.push(arg);
  }
}

function falsyFlag(value) {
  return ["false", "0", "no", "off"].includes(String(value || "").toLowerCase());
}

function wantsVertex(options = {}) {
  if (options["no-vertex"] === "true" || options["no-vertex"] === true) return false;
  if ("vertex" in options) return !falsyFlag(options.vertex);
  return true;
}

function streamHarnessEvent(record = {}) {
  const raw = record.data?.raw;
  if (record.event === "status" && typeof raw?.type === "string" && raw.type.startsWith("antigravity.")) {
    process.stderr.write(`${JSON.stringify(raw)}\n`);
    return;
  }
  process.stderr.write(`${JSON.stringify({
    type: "ge.harness.event",
    event: record.event,
    data: record.data,
    createdAt: record.createdAt,
  })}\n`);
}

function printHelp() {
  console.log(`Usage:
  ge-harness [--port <n>] [--host <addr>] [--no-open]
  ge-harness daemon [--port <n>] [--host <addr>]
  ge-harness web [--port <n>] [--host <addr>] [--daemon-url <url>] [--no-open]
  ge-harness doctor
  ge-harness skills
  ge-harness reset
  ge-harness create --usecase <id> --name <name> [--rows <n>] [--seed <n>] [--harness-review true --harness-refine true] [--vertex true|false] [--no-vertex] [--project <gcp-project> --location global]
  ge-harness create --freeform <description> --name <name> [--systems a,b] [--domain <d>] [--no-agents-cli]
  ge-harness validate <workspace-id>
  ge-harness preview <workspace-id> [--port <n>]
  ge-harness promote:packet <workspace-id>
  ge-harness deploy:plan <workspace-id> [--target agent_runtime|cloud_run]
  ge-harness publish:plan <workspace-id> [--app-id <id>]
  ge-harness factory plan [--usecases <id,id>] [--department all|hr] [--domain <id>] [--limit <n|all>] [--target <stage>] [--project <gcp-project>]
  ge-harness factory run [--plan .ge/factory/factory-plan.json] [--target <created|validated|harness_reviewed|harness_refined|data_packaged|previewed|deploy_planned|deployed|registered|publish_planned|published>] [--vertex true|false] [--no-vertex] [--project <gcp-project> --location global] [--continue true] [--stream true]
  ge-harness factory control-plane --project <gcp-project> [--region us-central1] [--bucket <name>]
  ge-harness factory provision --project <gcp-project> [--region us-central1] [--bucket <name>] [--apply true]
  ge-harness factory submit --workspace <id> --project <gcp-project> [--project-number <n>] [--stage validate] [--target publish_enterprise] [--dispatch queue|execute] [--workspace-archive gs://...] [--artifact-prefix gs://...] [--run-agent-evals true]
  ge-harness factory status [--plan .ge/factory/factory-plan.json]
  ge-harness agent run --workspace-dir <dir> --message <prompt> [--agent antigravity-sdk|agy|gemini] [--vertex true|false] [--no-vertex] [--project <gcp-project> --location us-central1]
  ge-harness workspace list
  ge-harness workspace create <name>
  ge-harness workspace doctor <workspace-id> [--stage validate|preview|promote|deploy:plan|publish:plan]
  ge-harness workspace repair <workspace-id> [--stage preview|promote|deploy:plan|publish:plan] [--agent codex|antigravity-sdk|gemini|claude|none] [--attempts 3]

Starts the local GE Demo Generator harness.

Default mode serves API and web together for backwards compatibility.
Use "daemon" and "web" as separate processes for development.

Environment:
  GE_HARNESS_PORT   Port to bind, default 17654.
  GE_HARNESS_HOST   Host to bind, default 127.0.0.1.
  GE_HARNESS_DAEMON_URL  Backend URL used by "web", default http://127.0.0.1:17654.`);
}

async function runCommand(args) {
  const [command, subcommand, ...rest] = args;
  if (command === "reset") {
    rmSync(DATA_ROOT, { recursive: true, force: true });
    mkdirSync(DATA_ROOT, { recursive: true });
    mkdirSync(PROJECTS_ROOT, { recursive: true });
    console.log(`reset: removed local factory workspace state at ${displayPath(DATA_ROOT)}`);
    return true;
  }

  mkdirSync(DATA_ROOT, { recursive: true });
  mkdirSync(PROJECTS_ROOT, { recursive: true });

  if (command === "daemon" || command === "web") return false;

  if (command === "doctor") {
    await ensureDefaultProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT });
    const report = await runPreflight({
      repoRoot: REPO_ROOT,
      dataRoot: DATA_ROOT,
      daemonPort: port,
      webPort: Number(process.env.GE_HARNESS_WEB_PORT) || 17655,
    });
    report.projects = (await listProjects({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT })).length;
    await writeJsonArtifact(DATA_ROOT, "doctor-report.json", report);
    console.log(JSON.stringify(report, null, 2));
    return true;
  }

  if (command === "skills") {
    console.log(JSON.stringify(await loadSkillRegistry(REPO_ROOT), null, 2));
    return true;
  }

  if (command === "create") {
    await createGoldenPath(flags);
    return true;
  }

  if (command === "validate") {
    await validateWorkspace(args[1], flags);
    return true;
  }

  if (command === "preview") {
    await previewWorkspace(args[1], flags);
    return true;
  }

  if (command === "promote:packet") {
    await writePromotionPacket(args[1]);
    return true;
  }

  if (command === "deploy:plan") {
    await writeDeployPlan(args[1], flags);
    return true;
  }

  if (command === "publish:plan") {
    await writePublishPlan(args[1], flags);
    return true;
  }

  if (command === "factory" && subcommand === "plan") {
    const result = await createFactoryPlan({ repoRoot: REPO_ROOT, dataRoot: DATA_ROOT, options: flags });
    console.log(JSON.stringify({
      ok: true,
      plan: result.planPath,
      markdown: result.mdPath,
      totals: result.plan.totals,
      targetStage: result.plan.targetStage,
    }, null, 2));
    return true;
  }

  if (command === "factory" && subcommand === "run") {
    const result = await runFactoryPlan({
      repoRoot: REPO_ROOT,
      dataRoot: DATA_ROOT,
      planPath: flags.plan,
      options: flags,
    });
    console.log(JSON.stringify({
      ok: result.run.ok,
      run: result.runPath,
      markdown: result.mdPath,
      totals: result.run.totals,
      targetStage: result.run.targetStage,
    }, null, 2));
    if (!result.run.ok) process.exitCode = 1;
    return true;
  }

  if (command === "factory" && subcommand === "control-plane") {
    const plan = buildControlPlanePlanFromFlags(flags);
    const outRel = flags.output || "factory/control-plane-plan.json";
    const outPath = await writeJsonArtifact(DATA_ROOT, outRel, plan);
    console.log(JSON.stringify({ ok: true, plan: outPath, commands: plan.commands, services: plan.services }, null, 2));
    return true;
  }

  if (command === "factory" && subcommand === "provision") {
    const plan = buildControlPlanePlanFromFlags(flags);
    const apply = flags.apply === "true" || flags.apply === true;
    const outRel = flags.output || "factory/control-plane-provision.json";
    const outPath = await writeJsonArtifact(DATA_ROOT, outRel, {
      ...plan,
      apply,
      generatedAt: new Date().toISOString(),
    });
    const result = apply ? await executeProvisionSteps(plan.provisionSteps) : { applied: false, steps: plan.provisionSteps.map((step) => ({ id: step.id, status: "planned" })) };
    console.log(JSON.stringify({
      ok: result.steps.every((step) => !["failed"].includes(step.status)),
      applied: apply,
      plan: outPath,
      project: plan.project,
      region: plan.region,
      services: plan.services,
      steps: result.steps,
    }, null, 2));
    if (result.steps.some((step) => step.status === "failed")) process.exitCode = 1;
    return true;
  }

  if (command === "factory" && subcommand === "submit") {
    const result = await submitFactoryRun(flags);
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exitCode = 1;
    return true;
  }

  if (command === "factory" && subcommand === "status") {
    const { readFile } = await import("node:fs/promises");
    const path = resolve(flags.plan || join(DATA_ROOT, "factory", "factory-plan.json"));
    const plan = JSON.parse(await readFile(path, "utf8"));
    console.log(JSON.stringify({
      ok: true,
      plan: path,
      generatedAt: plan.generatedAt,
      targetStage: plan.targetStage,
      totals: plan.totals,
      statuses: (plan.workItems || []).reduce((acc, item) => {
        acc[item.status || "planned"] = (acc[item.status || "planned"] || 0) + 1;
        return acc;
      }, {}),
    }, null, 2));
    return true;
  }

  if (command === "agent" && subcommand === "run") {
    const workspaceDir = resolve(flags["workspace-dir"] || flags.dir || PROJECTS_ROOT);
    const message = flags.message || rest.join(" ");
    const streamEvents = flags["stream-events"] === "true" || flags["stream-events"] === true || process.env.GE_HARNESS_STREAM_EVENTS === "1";
    let result;
    try {
      result = await runHarnessTask({
        repoRoot: REPO_ROOT,
        dataRoot: DATA_ROOT,
        workspaceDir,
        agentId: flags.agent || flags.provider || "antigravity-sdk",
        message,
        stages: flags.stage ? String(flags.stage).split(",") : ["review"],
        permissionProfile: flags["permission-profile"] || "review",
        model: flags.model || "default",
        vertex: wantsVertex(flags),
        project: flags.project || flags["gcp-project"] || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || null,
        location: flags.location || flags.region || process.env.GOOGLE_CLOUD_LOCATION || process.env.GOOGLE_GENAI_LOCATION || null,
        timeoutSec: Number(flags["timeout-sec"] || 0),
        onEvent: streamEvents ? streamHarnessEvent : null,
      });
    } catch (error) {
      console.log(JSON.stringify({
        ok: false,
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      }, null, 2));
      process.exitCode = 1;
      return true;
    }
    console.log(JSON.stringify({
      ok: result.ok,
      status: result.status,
      code: result.code,
      signal: result.signal,
      text: result.text,
      stderr: result.stderr,
      runtime: {
        adapterId: result.plan.adapterId,
        permissionProfile: result.plan.permissionProfile.id,
        requestedCapabilities: result.plan.requestedCapabilities,
        skills: result.plan.skills.map((skill) => ({
          id: skill.id,
          path: skill.relativePath,
          workspacePath: skill.workspaceRelativePath,
          capability: skill.capability,
        })),
      },
    }, null, 2));
    if (!result.ok) process.exitCode = 1;
    return true;
  }

  if (command === "workspace" && subcommand === "list") {
    await ensureDefaultProject({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT });
    const projects = await listProjects({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT });
    for (const project of projects) {
      console.log(`${project.id}\t${project.kind}\t${project.name}\t${project.path}`);
    }
    return true;
  }

  if (command === "workspace" && subcommand === "create") {
    const name = rest.join(" ").trim();
    if (!name) {
      console.error("workspace create requires a name");
      process.exitCode = 2;
      return true;
    }
    const project = await createProject({
      storePath: PROJECT_STORE,
      projectsRoot: PROJECTS_ROOT,
      name,
      kind: "workspace",
    });
    console.log(`${project.id}\t${project.path}`);
    return true;
  }

  if (command === "workspace" && subcommand === "doctor") {
    await doctorWorkspace(rest[0], flags);
    return true;
  }

  if (command === "workspace" && subcommand === "repair") {
    await repairWorkspace(rest[0], flags);
    return true;
  }

  if (command) {
    console.error(`unknown command: ${args.join(" ")}`);
    printHelp();
    process.exitCode = 2;
    return true;
  }
  return false;
}

function buildControlPlanePlanFromFlags(options = {}) {
  const project = options.project || process.env.GOOGLE_CLOUD_PROJECT;
  if (!project) throw new Error("--project required or set GOOGLE_CLOUD_PROJECT");
  return buildControlPlanePlan({
    project,
    projectNumber: options["project-number"] || process.env.GOOGLE_CLOUD_PROJECT_NUMBER,
    region: options.region || process.env.GE_AGENT_RUNTIME_REGION || "us-central1",
    bucket: options.bucket,
    queue: options.queue,
    topic: options.topic,
    workerService: options.worker || options["worker-service"],
    buildTrigger: options["build-trigger"],
    serviceAccount: options["service-account"],
  });
}

function runGcloud(args, opts = {}) {
  return new Promise((resolveRun) => {
    const child = spawn("gcloud", args, {
      cwd: opts.cwd || REPO_ROOT,
      env: { ...process.env, ...(opts.env || {}) },
      stdio: opts.stream ? "inherit" : "pipe",
    });
    let stdout = "";
    let stderr = "";
    if (!opts.stream) {
      child.stdout?.on("data", (chunk) => { stdout += chunk; });
      child.stderr?.on("data", (chunk) => { stderr += chunk; });
    }
    child.on("error", (error) => resolveRun({ code: 1, stdout, stderr: error.message }));
    child.on("close", (code) => resolveRun({ code, stdout, stderr }));
  });
}

function runLocal(command, args, opts = {}) {
  return new Promise((resolveRun) => {
    const child = spawn(command, args, {
      cwd: opts.cwd || REPO_ROOT,
      env: { ...process.env, ...(opts.env || {}) },
      stdio: opts.stream ? "inherit" : "pipe",
    });
    let stdout = "";
    let stderr = "";
    if (!opts.stream) {
      child.stdout?.on("data", (chunk) => { stdout += chunk; });
      child.stderr?.on("data", (chunk) => { stderr += chunk; });
    }
    child.on("error", (error) => resolveRun({ code: 1, stdout, stderr: error.message }));
    child.on("close", (code) => resolveRun({ code: code ?? 1, stdout, stderr }));
  });
}

async function submitFactoryRun(options = {}) {
  const workspaceId = options.workspace || options["workspace-id"];
  if (!workspaceId) throw new Error("--workspace required");
  const projectId = options.project || process.env.GOOGLE_CLOUD_PROJECT;
  if (!projectId) throw new Error("--project required or set GOOGLE_CLOUD_PROJECT");
  const region = options.region || options["runtime-region"] || process.env.GE_AGENT_RUNTIME_REGION || "us-central1";
  const bucket = options.bucket || process.env.GE_AGENT_FACTORY_BUCKET || `${projectId}-ge-agent-factory`;
  const queue = options.queue || process.env.GE_AGENT_FACTORY_QUEUE || "ge-agent-factory-stages";
  const topic = options.topic || process.env.GE_AGENT_FACTORY_TOPIC || "ge-agent-factory-events";
  const workerService = options.worker || options["worker-service"] || "ge-agent-factory-worker";
  const serviceAccount = options["service-account"] || `ge-agent-factory-runner@${projectId}.iam.gserviceaccount.com`;
  const runId = options["run-id"] || `run-${new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14)}-${randomUUID().slice(0, 8)}`;
  const stage = options.stage || "validate";
  const targetStage = options.target || "publish_enterprise";
  const dispatch = options.dispatch || (options.execute === "true" ? "execute" : "queue");
  if (!["queue", "execute"].includes(dispatch)) throw new Error("--dispatch must be queue or execute");
  const { project, dir } = await getWorkspace(workspaceId);
  const workspaceManifest = await readJsonIfExists(join(dir, "workspace.json"), {});
  const useCaseId = options.usecase || options["use-case"] || inferUseCaseId(workspaceManifest, project);
  const itemId = options.item || project.id;
  const archiveDir = join(DATA_ROOT, "factory", "runs", runId, "items", itemId);
  const archivePath = join(archiveDir, "workspace.tar.gz");
  const artifactPrefix = options["artifact-prefix"] || `gs://${bucket}/runs/${runId}/items/${itemId}`;
  const workspaceArchive = options["workspace-archive"] || `${artifactPrefix}/workspace.tar.gz`;
  if (!options["workspace-archive"]) {
    await mkdir(archiveDir, { recursive: true });
    const tar = await runLocal("tar", [
      "--exclude", ".venv",
      "--exclude", "node_modules",
      "--exclude", ".pytest_cache",
      "--exclude", "__pycache__",
      "--exclude", ".ruff_cache",
      "--exclude", ".mypy_cache",
      "--exclude", "dist",
      "--exclude", "build",
      "-czf", archivePath,
      "-C", dir,
      ".",
    ], { stream: false });
    if (tar.code !== 0) return { ok: false, stage: "archive", error: tar.stderr || tar.stdout };
    const upload = await runGcloud(["storage", "cp", archivePath, workspaceArchive], { stream: false });
    if (upload.code !== 0) return { ok: false, stage: "upload", error: upload.stderr || upload.stdout };
  }

  const payload = {
    runId,
    itemId,
    workspaceId: project.id,
    stage,
    attempt: 1,
    targetStage,
    workspaceDir: `/tmp/ge-agent-factory/${runId}/${itemId}/workspace`,
    workspaceArchive,
    artifactPrefix,
    workerService,
    cloud: {
      projectId,
      projectNumber: options["project-number"] || process.env.GOOGLE_CLOUD_PROJECT_NUMBER || "",
      runtimeRegion: region,
      genaiLocation: options["genai-location"] || process.env.GOOGLE_GENAI_LOCATION || "global",
      geminiEnterpriseLocation: options["gemini-enterprise-location"] || process.env.GEMINI_ENTERPRISE_LOCATION || "global",
      geminiEnterpriseApp: options["gemini-enterprise-app-id"] || process.env.GEMINI_ENTERPRISE_APP_ID || "",
      pubsubTopic: topic,
      tasksQueue: queue,
      artifactBucket: bucket,
      serviceAccount,
    },
    options: {
      targetRuntime: options["target-runtime"] || options.runtime || "agent_runtime",
      registerAs: options["register-as"] || "adk",
      useCaseId,
      freeform: workspaceManifest.goal || project.name || "",
      runAgentEvals: options["run-agent-evals"] === "true" || options["run-agent-evals"] === true,
    },
  };
  const now = new Date().toISOString();
  await patchFirestoreDocument({
    projectId,
    path: `factoryRuns/${runId}`,
    data: {
      status: "queued",
      createdAt: now,
      updatedAt: now,
      targetStage,
      source: "ge-harness-cli",
      workspaceId: project.id,
      artifactPrefix,
    },
  });
  await patchFirestoreDocument({
    projectId,
    path: `factoryRuns/${runId}/items/${itemId}`,
    data: {
      status: "queued",
      currentStage: stage,
      createdAt: now,
      updatedAt: now,
      workspaceId: project.id,
      workspaceArchive,
      artifactPrefix,
      targetStage,
    },
  });
  await patchFirestoreDocument({
    projectId,
    path: `factoryRuns/${runId}/items/${itemId}/stages/${stage}`,
    data: {
      status: "queued",
      createdAt: now,
      updatedAt: now,
      attempt: 1,
      owner: "cloud_tasks",
      nextStage: null,
      error: null,
    },
  });
  if (dispatch === "execute") {
    const executed = await executeFactoryStageNow(payload, { wait: options.wait === "true" || options.wait === true });
    if (!executed.ok) {
      await patchFirestoreDocument({
        projectId,
        path: `factoryRuns/${runId}/items/${itemId}/stages/${stage}`,
        data: { status: "execute_failed", updatedAt: new Date().toISOString(), error: executed.stderr || executed.stdout || "failed to execute Cloud Run worker service" },
      });
      return { ok: false, runId, itemId, stage, workspaceArchive, artifactPrefix, error: executed.stderr || executed.stdout };
    }
    return {
      ok: true,
      runId,
      itemId,
      workspaceId: project.id,
      stage,
      targetStage,
      workspaceArchive,
      artifactPrefix,
      dispatch,
      serviceUrl: executed.url,
      response: executed.result || null,
      workerService,
    };
  }

  const queued = await enqueueFactoryStage(payload, { transport: "gcloud" });
  if (!queued.ok) {
    await patchFirestoreDocument({
      projectId,
      path: `factoryRuns/${runId}/items/${itemId}/stages/${stage}`,
      data: { status: "queue_failed", updatedAt: new Date().toISOString(), error: queued.stderr || queued.stdout || "failed to create Cloud Task" },
    });
    return { ok: false, runId, itemId, stage, workspaceArchive, artifactPrefix, error: queued.stderr || queued.stdout, taskId: queued.taskId };
  }
  return {
    ok: true,
    runId,
    itemId,
    workspaceId: project.id,
    stage,
    targetStage,
    workspaceArchive,
    artifactPrefix,
    taskId: queued.taskId,
    queue,
    dispatch,
    workerService,
  };
}

async function readJsonIfExists(path, fallback = null) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return fallback;
    return fallback;
  }
}

function inferUseCaseId(manifest = {}, project = {}) {
  if (manifest.useCaseId) return manifest.useCaseId;
  const sourceSlide = manifest.sourceSlide || manifest.source?.slide || "";
  const slideMatch = String(sourceSlide).match(/([^/\\]+)\.tsx$/);
  if (slideMatch?.[1]) return slideMatch[1];
  const text = [
    manifest.goal,
    manifest.name,
    project.name,
    ...(Array.isArray(manifest.systems?.items) ? manifest.systems.items.map((item) => item.name || item.id || item) : []),
  ].join(" ").toLowerCase();
  if (
    text.includes("benefit")
    && (text.includes("enrollment") || text.includes("workday") || text.includes("hr") || text.includes("people"))
  ) {
    return "BenefitsAssistant";
  }
  return null;
}

async function executeFactoryStageNow(payload, { wait = false } = {}) {
  const url = await resolveServiceUrl(payload);
  const serviceAccount = payload.cloud?.serviceAccount || `ge-agent-factory-runner@${payload.cloud?.projectId}.iam.gserviceaccount.com`;
  let tokenResult = await runGcloud([
    "auth", "print-identity-token",
    "--impersonate-service-account", serviceAccount,
    "--audiences", url
  ], { stream: false });
  if (tokenResult.code !== 0) {
    tokenResult = await runGcloud(["auth", "print-identity-token", "--audiences", url], { stream: false });
  }
  if (tokenResult.code !== 0 || !tokenResult.stdout.trim()) {
    return {
      ok: false,
      code: tokenResult.code || 1,
      stdout: tokenResult.stdout,
      stderr: tokenResult.stderr || "failed to mint Cloud Run identity token",
      url,
      command: ["gcloud", ["auth", "print-identity-token", "--impersonate-service-account", serviceAccount, "--audiences", url]],
    };
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${tokenResult.stdout.trim()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let parsed = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {}
  return {
    ok: res.ok && parsed?.ok !== false,
    code: res.ok && parsed?.ok !== false ? 0 : 1,
    stdout: res.ok ? text : "",
    stderr: res.ok ? "" : `HTTP ${res.status} ${res.statusText}: ${text}`,
    url,
    result: parsed,
    wait,
    command: ["POST", url],
  };
}

async function executeProvisionSteps(steps) {
  const results = [];
  for (const step of steps) {
    if (step.kind === "artifact") {
      results.push({ id: step.id, status: "available", path: step.path, triggerName: step.triggerName });
      continue;
    }
    if (step.check) {
      const check = await runGcloud(step.check);
      if (check.code === 0 && step.createIfMissing) {
        results.push({ id: step.id, status: "exists", description: step.description });
        continue;
      }
      if (check.code !== 0 && !step.ignoreCheckFailure && !step.createIfMissing) {
        results.push({ id: step.id, status: "failed", phase: "check", description: step.description, error: check.stderr || check.stdout });
        continue;
      }
    }
    if (!step.apply) {
      results.push({ id: step.id, status: "skipped", description: step.description });
      continue;
    }
    const applied = await runGcloud(step.apply);
    results.push({
      id: step.id,
      status: applied.code === 0 ? "applied" : "failed",
      description: step.description,
      code: applied.code,
      output: applied.code === 0 ? summarizeCommandOutput(applied.stdout) : undefined,
      error: applied.code === 0 ? undefined : applied.stderr || applied.stdout,
    });
    if (applied.code !== 0) break;
  }
  return { applied: true, steps: results };
}

function summarizeCommandOutput(output) {
  const text = String(output || "").trim();
  if (!text) return undefined;
  const lines = text.split(/\r?\n/).filter(Boolean);
  const useful = lines.filter((line) => /^(Created|Updated|Operation|Enabled|Creating|ERROR|WARNING)/.test(line));
  return (useful.length ? useful : lines.slice(-3)).join("\n").slice(0, 1000);
}

function runNodeScript(script, args, opts = {}) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(process.execPath, [script, ...args], {
      cwd: opts.cwd || REPO_ROOT,
      env: { ...process.env, ...(opts.env || {}) },
      stdio: opts.stdio || "pipe",
    });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (chunk) => {
      stdout += chunk;
      if (opts.stream) process.stdout.write(chunk);
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk;
      if (opts.stream) process.stderr.write(chunk);
    });
    child.on("error", rejectRun);
    child.on("close", (code) => {
      if (code !== 0 && !opts.allowFail) {
        rejectRun(new Error(stderr.trim() || `${script} exited ${code}`));
        return;
      }
      resolveRun({ code, stdout, stderr });
    });
  });
}

async function getWorkspace(id) {
  if (!id) throw new Error("workspace id required");
  const projects = await listProjects({ storePath: PROJECT_STORE, projectsRoot: PROJECTS_ROOT });
  const project = projects.find((item) => item.id === id || item.name === id);
  if (!project) throw new Error(`workspace not found: ${id}`);
  return { project, dir: projectDir(PROJECTS_ROOT, project.id), manifestPath: workspaceManifestPath(PROJECTS_ROOT, project.id) };
}

async function createGoldenPath(options) {
  const name = options.name || options.usecase || options.freeform || "agent-demo";
  const project = await createProject({
    storePath: PROJECT_STORE,
    projectsRoot: PROJECTS_ROOT,
    name,
    kind: "workspace",
    useCaseId: options.usecase || null,
    departmentId: options.domain || null,
  });
  const workspaceDir = projectDir(PROJECTS_ROOT, project.id);
  const scaffold = options["no-agents-cli"] === "true"
    ? { ok: false, skipped: true, reason: "--no-agents-cli" }
    : await scaffoldWithAgentsCli({
        workspaceDir,
        projectName: project.id,
        dataRoot: DATA_ROOT,
        repoRoot: REPO_ROOT,
      });
  const args = ["from-usecase", "--dir", workspaceDir, "--rows", options.rows || "30", "--seed", options.seed || "42", "--force-agent", "true"];
  if (options.usecase) args.push("--usecase", options.usecase);
  else args.push("--freeform", options.freeform || name);
  if (options.systems) args.push("--systems", options.systems);
  if (options.domain) args.push("--domain", options.domain);
  if (options["harness-review"]) args.push("--harness-review", options["harness-review"]);
  if (options["harness-refine"]) args.push("--harness-refine", options["harness-refine"]);
  if (options["harness-review"] || options["harness-refine"] || "vertex" in options || "no-vertex" in options) {
    args.push("--vertex", wantsVertex(options) ? "true" : "false");
  }
  if (options.project || options["gcp-project"]) args.push("--project", options.project || options["gcp-project"]);
  if (options.location || options.region) args.push("--location", options.location || options.region);

  await runNodeScript(GE_MOCK, args, { stream: true });
  await runNodeScript(GE_MOCK, ["test", "--dir", workspaceDir, "--run", options["run-tests"] || "false"], { stream: true, allowFail: true });
  const manifest = await updateWorkspaceCapabilities({
    workspaceDir,
    manifestPath: workspaceManifestPath(PROJECTS_ROOT, project.id),
    patch: {
      goal: options.freeform || options.usecase || name,
      repoRoot: REPO_ROOT,
      mode: options.mode || "local_mock",
      useCaseId: options.usecase || null,
      departmentId: options.domain || null,
    },
  });
  console.log(JSON.stringify({
    ok: true,
    command: "create",
    scaffold,
    workspace: { id: project.id, name: project.name, path: workspaceDir },
    capabilities: manifest.capabilities,
    readiness: manifest.readiness,
    nextActions: manifest.nextActions,
  }, null, 2));
}

async function validateWorkspace(id, options = {}) {
  const { project, dir, manifestPath } = await getWorkspace(id);
  const test = await runNodeScript(GE_MOCK, ["test", "--dir", dir, "--run", options.run || "true"], { stream: true, allowFail: true });
  const testsRequested = (options.run || "true") !== "false";
  const report = await validateAgentWorkspace({
    workspaceDir: dir,
    manifestPath,
    workspaceId: project.id,
    repoRoot: REPO_ROOT,
    testsRequested,
    testExitCode: test.code,
    source: "cli",
  });
  console.log(JSON.stringify(report, null, 2));
}

async function previewWorkspace(id, options = {}) {
  const { project, dir, manifestPath } = await getWorkspace(id);
  if (!workspaceHasLocalAgent(dir)) throw new Error("workspace has no local ADK agent; run create first");
  if (!await requireWorkspaceGate({ project, dir, manifestPath, stage: "preview" })) return;
  const result = await runAdkPreviewForWorkspace({
    workspaceDir: dir,
    projectId: project.id,
    prompt: options.prompt || "hello",
    repoRoot: REPO_ROOT,
    dataRoot: DATA_ROOT,
    source: "cli-preview",
  });
  console.log(JSON.stringify({ ok: result.ok === true, previewReport: result.previewReport, promotionPacket: result.promotionPacket, response: result.response, code: result.code }, null, 2));
  if (!result.ok) process.exitCode = 1;
}

async function writePromotionPacket(id) {
  const { project, dir, manifestPath } = await getWorkspace(id);
  if (!await requireWorkspaceGate({ project, dir, manifestPath, stage: "promote" })) return;
  const promotion = await createPromotionPacket({
    workspaceDir: dir,
    manifestPath,
    projectId: project.id,
    repoRoot: REPO_ROOT,
    source: "cli",
  });
  console.log(JSON.stringify({ ok: true, paths: promotion.paths, nextActions: promotion.packet.nextActions }, null, 2));
}

async function writeDeployPlan(id, options = {}) {
  const { project, dir, manifestPath } = await getWorkspace(id);
  if (!await requireWorkspaceGate({ project, dir, manifestPath, stage: "deploy:plan" })) return;
  const manifest = await updateWorkspaceCapabilities({ workspaceDir: dir, manifestPath, patch: { repoRoot: REPO_ROOT } });
  const target = options.target || "agent_runtime";
  const plan = buildDeployPlan({ projectId: project.id, workspaceDir: dir, readiness: manifest.readiness, target });
  await writeJsonArtifact(dir, ARTIFACT_PATHS.deployPlan, plan);
  await writeMarkdownArtifact(dir, ARTIFACT_PATHS.deployPlanMarkdown, renderPlanMarkdown("Deploy Plan", plan));
  const updated = await updateWorkspaceCapabilities({ workspaceDir: dir, manifestPath, patch: { repoRoot: REPO_ROOT } });
  console.log(JSON.stringify({ ok: true, plan: ARTIFACT_PATHS.deployPlanMarkdown, readiness: updated.readiness, nextActions: updated.nextActions }, null, 2));
}

async function writePublishPlan(id, options = {}) {
  const { project, dir, manifestPath } = await getWorkspace(id);
  if (!await requireWorkspaceGate({ project, dir, manifestPath, stage: "publish:plan" })) return;
  const manifest = await updateWorkspaceCapabilities({ workspaceDir: dir, manifestPath, patch: { repoRoot: REPO_ROOT } });
  const plan = buildPublishPlan({
    projectId: project.id,
    workspaceDir: dir,
    readiness: manifest.readiness,
    appId: options["app-id"] || "<GEMINI_ENTERPRISE_APP_ID>",
  });
  await writeJsonArtifact(dir, ARTIFACT_PATHS.publishPlan, plan);
  await writeMarkdownArtifact(dir, ARTIFACT_PATHS.publishPlanMarkdown, renderPlanMarkdown("Publish Plan", plan));
  const updated = await updateWorkspaceCapabilities({ workspaceDir: dir, manifestPath, patch: { repoRoot: REPO_ROOT } });
  console.log(JSON.stringify({ ok: true, plan: ARTIFACT_PATHS.publishPlanMarkdown, readiness: updated.readiness, nextActions: updated.nextActions }, null, 2));
}

async function requireWorkspaceGate({ project, dir, manifestPath, stage }) {
  const report = await runWorkspaceDoctor({
    workspaceDir: dir,
    manifestPath,
    workspaceId: project.id,
    repoRoot: REPO_ROOT,
    stage,
  });
  if (report.ok) return report;
  console.log(JSON.stringify({ ok: false, doctor: report }, null, 2));
  process.exitCode = 1;
  return null;
}

async function doctorWorkspace(id, options = {}) {
  const { project, dir, manifestPath } = await getWorkspace(id);
  const report = await runWorkspaceDoctor({
    workspaceDir: dir,
    manifestPath,
    workspaceId: project.id,
    repoRoot: REPO_ROOT,
    stage: options.stage || "validate",
  });
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
}

function buildHarnessRepairMessage({ project, stage, task, doctor }) {
  return [
    "Repair this generated ADK workspace so it passes the GE workspace doctor gate.",
    "",
    `Workspace id: ${project.id}`,
    `Target stage: ${stage}`,
    `Repair task: ${task.id}`,
    `Reason: ${task.reason}`,
    "",
    "Doctor blockers:",
    ...doctor.blockers.map((blocker) => `- ${blocker.id}: ${blocker.message}`),
    "",
    "Use the workspace contract and existing project patterns. Keep edits scoped to the generated workspace unless a repository-level generator bug is required to unblock this workspace. After edits, run the relevant local validation command.",
  ].join("\n");
}

async function repairWorkspace(id, options = {}) {
  const { project, dir, manifestPath } = await getWorkspace(id);
  const stage = options.stage || "preview";
  const agentId = options.agent || options.provider || "codex";
  const maxAttempts = Number(options.attempts || options["max-attempts"] || 3);
  const runPreview = options["run-preview"] !== "false";
  const executors = {
    "run-validation": async () => {
      const test = await runNodeScript(GE_MOCK, ["test", "--dir", dir, "--run", options.run || "true"], { stream: true, allowFail: true });
      const report = await validateAgentWorkspace({
        workspaceDir: dir,
        manifestPath,
        workspaceId: project.id,
        repoRoot: REPO_ROOT,
        testsRequested: (options.run || "true") !== "false",
        testExitCode: test.code,
        source: "repair",
      });
      return { ok: report.ok, summary: `validation ${report.ok ? "passed" : "failed"}` };
    },
    "repair-spec-code": async (task, context) => {
      if (agentId === "none" || agentId === "deterministic") {
        return { ok: false, skipped: true, summary: "harness repair disabled by --agent none" };
      }
      const result = await runHarnessTask({
        repoRoot: REPO_ROOT,
        dataRoot: DATA_ROOT,
        workspaceDir: dir,
        agentId,
        message: buildHarnessRepairMessage({ project, stage, task, doctor: context.doctor }),
        task,
        stages: ["repair", "validate", "adk"],
        permissionProfile: options["permission-profile"] || "workspace_write",
        model: options.model || "default",
        vertex: wantsVertex(options),
        project: options.project || options["gcp-project"] || null,
        location: options.location || options.region || null,
        timeoutSec: Number(options["timeout-sec"] || 0),
        allowFallback: options["allow-fallback"] === "true",
      });
      return { ok: result.ok, summary: `${result.plan.adapterId} exited ${result.code ?? "unknown"}` };
    },
    "run-preview": async () => {
      if (!runPreview) return { ok: false, skipped: true, summary: "preview repair disabled by --run-preview false" };
      const result = await runAdkPreviewForWorkspace({
        workspaceDir: dir,
        projectId: project.id,
        prompt: options.prompt || "hello",
        repoRoot: REPO_ROOT,
        dataRoot: DATA_ROOT,
        source: "repair-preview",
      });
      return { ok: result.ok === true, summary: `preview exited ${result.code ?? "unknown"}` };
    },
    "write-promotion-packet": async () => {
      const promotion = await createPromotionPacket({
        workspaceDir: dir,
        manifestPath,
        projectId: project.id,
        repoRoot: REPO_ROOT,
        source: "repair",
      });
      return { ok: promotion.packet.promotionGate?.ok === true, summary: `promotion packet wrote ${promotion.paths.length} artifact(s)` };
    },
    "write-deploy-plan": async () => {
      const manifest = await updateWorkspaceCapabilities({ workspaceDir: dir, manifestPath, patch: { repoRoot: REPO_ROOT } });
      const plan = buildDeployPlan({ projectId: project.id, workspaceDir: dir, readiness: manifest.readiness, target: options.target || "agent_runtime" });
      await writeJsonArtifact(dir, ARTIFACT_PATHS.deployPlan, plan);
      await writeMarkdownArtifact(dir, ARTIFACT_PATHS.deployPlanMarkdown, renderPlanMarkdown("Deploy Plan", plan));
      return { ok: true, summary: ARTIFACT_PATHS.deployPlan };
    },
    "revalidate-before-publish": async () => executors["run-validation"](),
  };
  const report = await runWorkspaceRepair({
    workspaceDir: dir,
    manifestPath,
    workspaceId: project.id,
    repoRoot: REPO_ROOT,
    stage,
    maxAttempts,
    executors,
    source: "cli",
  });
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
}

if (!await runCommand(positionals)) {
  const mode = positionals[0] || "combined";
  const bindPort = mode === "web" && !explicitPort
    ? Number(process.env.GE_HARNESS_WEB_PORT) || 17655
    : port;
  const url = mode === "web"
    ? await (await import("./web-server.js")).startWebServer({ port: bindPort, host, daemonUrl })
    : await (await import("./server.js")).startServer({ port: bindPort, host, serveWeb: mode !== "daemon" });

  console.log(mode === "web"
    ? `[ge-harness-web] listening on ${url} → ${daemonUrl}`
    : mode === "daemon"
      ? `[ge-harness-daemon] listening on ${url}`
      : `[ge-harness] listening on ${url}`);

  if (open) {
    const opener = process.platform === "darwin" ? "open" : process.platform === "win32" ? "cmd" : "xdg-open";
    const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];
    spawn(opener, args, { detached: true, stdio: "ignore" }).unref();
  }
}
