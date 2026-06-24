import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { loadSkillRegistry, selectSkillsForContext } from "./skill-registry.js";
import { ARTIFACT_PATHS, DATA_PATHS, REQUIRED_WORKSPACE_FILES, WORKSPACE_PATHS } from "./workspace-contract.js";

export const CAPABILITY_ORDER = [
  "workspace",
  "mock_data",
  "adk_agent",
  "fixture_tools",
  "smoke_tests",
  "local_preview",
  "data_package",
  "deploy_plan",
  "deployment",
  "publish_plan",
  "published",
];

async function readJson(path, fallback = null) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function canAccess(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function status(ok, detail = {}) {
  return { status: ok ? "ready" : "missing", ...detail };
}

function existsRel(workspaceDir, relPath) {
  return Boolean(workspaceDir && relPath && existsSync(join(workspaceDir, relPath)));
}

function fileItem(workspaceDir, kind, relPath, required = false) {
  return {
    kind,
    path: relPath,
    required,
    exists: relPath === WORKSPACE_PATHS.workspaceManifest ? true : existsRel(workspaceDir, relPath),
  };
}

function mergeItems(existingItems = [], generatedItems = []) {
  const byPath = new Map();
  for (const item of existingItems) {
    if (item?.path) byPath.set(item.path, item);
  }
  for (const item of generatedItems) {
    if (item?.path) byPath.set(item.path, { ...byPath.get(item.path), ...item });
  }
  return Array.from(byPath.values());
}

function generatedFileItems(workspaceDir) {
  return [
    fileItem(workspaceDir, "workspace_manifest", WORKSPACE_PATHS.workspaceManifest, true),
    fileItem(workspaceDir, "spec", WORKSPACE_PATHS.useCaseSpec, true),
    fileItem(workspaceDir, "pipeline", WORKSPACE_PATHS.pipeline, true),
    fileItem(workspaceDir, "schema", WORKSPACE_PATHS.schema, true),
    fileItem(workspaceDir, "fixtures", WORKSPACE_PATHS.fixtureManifest, true),
    fileItem(workspaceDir, "agent", WORKSPACE_PATHS.agent, true),
    fileItem(workspaceDir, "tools", WORKSPACE_PATHS.tools, true),
    fileItem(workspaceDir, "pyproject", WORKSPACE_PATHS.pyproject, true),
    fileItem(workspaceDir, "smoke_test", WORKSPACE_PATHS.smokeTest, true),
    fileItem(workspaceDir, "golden_evals", WORKSPACE_PATHS.goldenEvals, false),
    fileItem(workspaceDir, "agents_cli_evalset", WORKSPACE_PATHS.behaviorEvalset, false),
    fileItem(workspaceDir, "agents_cli_eval_config", WORKSPACE_PATHS.evalConfig, false),
  ];
}

function artifactItems(workspaceDir) {
  return [
    fileItem(workspaceDir, "validation_report", ARTIFACT_PATHS.validationReport, false),
    fileItem(workspaceDir, "workspace_doctor", ARTIFACT_PATHS.workspaceDoctor, false),
    fileItem(workspaceDir, "spec_code_trace", ARTIFACT_PATHS.specCodeTrace, false),
    fileItem(workspaceDir, "preview_report", ARTIFACT_PATHS.previewReport, false),
    fileItem(workspaceDir, "promotion_packet", ARTIFACT_PATHS.promotionPacket, false),
    fileItem(workspaceDir, "deploy_plan", ARTIFACT_PATHS.deployPlan, false),
    fileItem(workspaceDir, "publish_plan", ARTIFACT_PATHS.publishPlan, false),
    fileItem(workspaceDir, "cloud_topology", ARTIFACT_PATHS.cloudTopology, false),
    fileItem(workspaceDir, "data_plan", DATA_PATHS.dataPlan, false),
    fileItem(workspaceDir, "cloud_data_manifest", DATA_PATHS.cloudDataManifest, false),
    fileItem(workspaceDir, "source_integration_plan", DATA_PATHS.sourceIntegrationPlan, false),
    fileItem(workspaceDir, "tool_registry_plan", DATA_PATHS.toolRegistryPlan, false),
  ];
}

function qualityFromReadiness(readiness) {
  return {
    smokeTests: readiness.tests?.status || "missing",
    specCodeTrace: readiness.specCodeTrace?.status || "missing",
    localPreview: readiness.localPreview?.status || "missing",
    dataPackage: readiness.dataPackage?.status || "missing",
  };
}

function registrationFromReadiness(readiness) {
  return {
    agentRegistryReady: readiness.deployment?.status === "ready" || readiness.published?.status === "ready",
    geminiEnterpriseReady: readiness.published?.status === "ready",
    deployPlanReady: readiness.deployPlan?.status === "ready",
    publishPlanReady: readiness.publishPlan?.status === "ready",
    runtimeReady: readiness.deployment?.status === "ready",
  };
}

export async function buildReadiness(workspaceDir) {
  const pipeline = await readJson(join(workspaceDir, WORKSPACE_PATHS.pipeline), {});
  const schema = await readJson(join(workspaceDir, WORKSPACE_PATHS.schema), null);
  const fixtureManifest = await readJson(join(workspaceDir, WORKSPACE_PATHS.fixtureManifest), null);
  const deploymentPlan = await readJson(join(workspaceDir, ARTIFACT_PATHS.deployPlan), null);
  const validationReport = await readJson(join(workspaceDir, ARTIFACT_PATHS.validationReport), null);
  const specCodeTrace = await readJson(join(workspaceDir, ARTIFACT_PATHS.specCodeTrace), null);
  const previewReport = await readJson(join(workspaceDir, ARTIFACT_PATHS.previewReport), null);
  const dataPlan = await readJson(join(workspaceDir, DATA_PATHS.dataPlan), null);
  const cloudDataPlan = await readJson(join(workspaceDir, DATA_PATHS.cloudDataManifest), null);
  const cloudTopology = await readJson(join(workspaceDir, ARTIFACT_PATHS.cloudTopology), null);
  const publishPlan = await readJson(join(workspaceDir, ARTIFACT_PATHS.publishPlan), null);
  const deploymentMeta = await readJson(join(workspaceDir, "deployment_metadata.json"), null);
  const registration = await readJson(join(workspaceDir, "gemini_enterprise_registration.json"), null);

  const files = {};
  for (const rel of REQUIRED_WORKSPACE_FILES) files[rel] = await canAccess(join(workspaceDir, rel));

  const testStep = pipeline.steps?.test || null;
  const validationPassed = validationReport?.ok === true || validationReport?.testExitCode === 0;
  const testPassed = testStep?.status === "done" || validationPassed;
  const testExitCode = validationReport?.testExitCode ?? testStep?.exitCode ?? null;
  const serveStep = pipeline.steps?.serve || null;
  const previewPassed = previewReport?.ok === true || serveStep?.status === "done" || serveStep?.status === "running";

  return {
    workspace: status(true),
    mockData: status(Boolean(fixtureManifest?.tables?.length), {
      tables: fixtureManifest?.tables?.length || 0,
      totalRows: fixtureManifest?.totalRows || 0,
      documents: fixtureManifest?.documents?.length || 0,
    }),
    schema: status(Boolean(schema?.tables?.length), {
      tables: schema?.tables?.length || 0,
      anomalies: schema?.anomalies?.length || 0,
    }),
    agent: status(files[WORKSPACE_PATHS.agent] && files[WORKSPACE_PATHS.tools] && files[WORKSPACE_PATHS.pyproject], {
      entrypoint: "app.agent:root_agent",
    }),
    tests: {
      status: testPassed ? "passing" : files["tests/test_smoke.py"] ? "created" : "missing",
      lastExitCode: testExitCode,
      output: files[WORKSPACE_PATHS.smokeTest] ? WORKSPACE_PATHS.smokeTest : null,
    },
    specCodeTrace: {
      status: specCodeTrace?.ok === true ? "passing" : specCodeTrace ? "failing" : "missing",
      output: specCodeTrace ? ARTIFACT_PATHS.specCodeTrace : null,
      requiredIntentCoverage: specCodeTrace?.coverage?.requiredIntentCoverage ?? null,
      blockers: specCodeTrace?.blockers || [],
    },
    localPreview: {
      status: serveStep?.status === "running" ? "running" : previewPassed ? "ready" : files[WORKSPACE_PATHS.agent] ? "available" : "missing",
      port: serveStep?.port || null,
      output: previewReport ? ARTIFACT_PATHS.previewReport : null,
    },
    dataPackage: {
      status: dataPlan || cloudDataPlan || cloudTopology ? "ready" : "missing",
      datastores: dataPlan?.datastores?.length || 0,
      cloudManifest: cloudDataPlan ? DATA_PATHS.cloudDataManifest : null,
      topology: cloudTopology ? ARTIFACT_PATHS.cloudTopology : null,
    },
    deployPlan: status(Boolean(deploymentPlan), {
      path: deploymentPlan ? ARTIFACT_PATHS.deployPlan : null,
    }),
    deployment: status(Boolean(deploymentMeta || pipeline.steps?.deploy?.status === "done"), {
      target: pipeline.steps?.deploy?.target || deploymentMeta?.target || null,
      runtimeId: deploymentMeta?.agent_runtime_id || pipeline.steps?.deploy?.runtimeId || null,
      serviceUrl: pipeline.steps?.deploy?.serviceUrl || null,
    }),
    publishPlan: status(Boolean(publishPlan), {
      path: publishPlan ? ARTIFACT_PATHS.publishPlan : null,
    }),
    published: status(Boolean(registration || pipeline.steps?.publish?.status === "done"), {
      appId: pipeline.steps?.publish?.appId || registration?.appId || null,
    }),
  };
}

export function nextActionsForReadiness(readiness) {
  if (readiness.mockData.status !== "ready" || readiness.agent.status !== "ready") return ["create"];
  if (!["passing", "created"].includes(readiness.tests.status)) return ["validate"];
  if (readiness.tests.status !== "passing") return ["validate"];
  if (readiness.specCodeTrace?.status !== "passing") return ["iterate"];
  if (!["running", "ready"].includes(readiness.localPreview.status)) return ["preview"];
  if (readiness.dataPackage?.status !== "ready") return ["data:package"];
  if (readiness.deployPlan.status !== "ready") return ["deploy:plan"];
  if (readiness.publishPlan.status !== "ready") return ["publish:plan"];
  return ["iterate", "deploy", "publish"];
}

export async function updateWorkspaceCapabilities({ workspaceDir, manifestPath, patch = {} }) {
  const manifest = await readJson(manifestPath, {});
  const repoRoot = patch.repoRoot || manifest.repoRoot || resolve(workspaceDir, "..", "..", "..");
  const skillRegistry = await loadSkillRegistry(repoRoot);
  const readiness = await buildReadiness(workspaceDir);
  const now = new Date().toISOString();
  const nextActions = nextActionsForReadiness(readiness);
  const nextAction = nextActions[0] || null;
  const capabilities = Array.from(new Set([
    ...(Array.isArray(manifest.capabilities) ? manifest.capabilities : []),
    ...CAPABILITY_ORDER.filter((capability) => {
      if (capability === "workspace") return true;
      if (capability === "mock_data") return readiness.mockData.status === "ready";
      if (capability === "adk_agent") return readiness.agent.status === "ready";
      if (capability === "fixture_tools") return readiness.agent.status === "ready";
      if (capability === "smoke_tests") return readiness.tests.status === "passing";
      if (capability === "local_preview") return ["running", "ready"].includes(readiness.localPreview.status);
      if (capability === "data_package") return readiness.dataPackage?.status === "ready";
      if (capability === "deploy_plan") return readiness.deployPlan.status === "ready";
      if (capability === "deployment") return readiness.deployment.status === "ready";
      if (capability === "publish_plan") return readiness.publishPlan.status === "ready";
      if (capability === "published") return readiness.published.status === "ready";
      return false;
    }),
  ]));

  const updated = {
    ...manifest,
    ...patch,
    repoRoot: patch.repoRoot || manifest.repoRoot || undefined,
    mode: patch.mode || manifest.mode || "local_mock",
    capabilities,
    skills: selectSkillsForContext({
      registry: skillRegistry,
      capabilities,
      stages: nextActions,
      message: [patch.goal, patch.useCaseId, patch.departmentId].filter(Boolean).join(" "),
    }).map((skill) => ({ id: skill.id, path: skill.relativePath, capability: skill.capability })),
    skillRegistry: {
      root: "skills",
      bindings: skillRegistry.bindings,
    },
    generatedFiles: mergeItems(manifest.generatedFiles, generatedFileItems(workspaceDir)),
    artifacts: {
      path: "artifacts",
      ...(manifest.artifacts || {}),
      items: mergeItems(manifest.artifacts?.items, artifactItems(workspaceDir)),
    },
    quality: {
      ...(manifest.quality || {}),
      ...qualityFromReadiness(readiness),
    },
    registration: {
      ...(manifest.registration || {}),
      ...registrationFromReadiness(readiness),
    },
    readiness,
    nextActions,
    nextAction,
    updatedAt: now,
  };
  await writeJson(manifestPath, updated);
  return updated;
}

export async function writeMarkdownArtifact(workspaceDir, relPath, content) {
  const path = join(workspaceDir, relPath);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, "utf8");
  return path;
}

export async function writeJsonArtifact(workspaceDir, relPath, value) {
  const path = join(workspaceDir, relPath);
  await writeJson(path, value);
  return path;
}

export function workspaceHasLocalAgent(workspaceDir) {
  return existsSync(join(workspaceDir, WORKSPACE_PATHS.agent)) && existsSync(join(workspaceDir, WORKSPACE_PATHS.tools));
}
