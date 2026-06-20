import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

export const WORKSPACE_SCHEMA_VERSION = 1;

export const WORKSPACE_PATHS = Object.freeze({
  workspaceManifest: "workspace.json",
  pipeline: "mock_systems/pipeline.json",
  schema: "mock_systems/schema.json",
  useCaseSpec: "mock_systems/usecase-spec.json",
  fixtureManifest: "fixtures/manifest.json",
  agent: "app/agent.py",
  tools: "app/tools.py",
  pyproject: "pyproject.toml",
  smokeTest: "tests/test_smoke.py",
  goldenEvals: "evals/golden.json",
  behaviorEvalset: "tests/eval/evalsets/ge_behavior_contract.evalset.json",
  evalConfig: "tests/eval/eval_config.json",
  optimizationConfig: "tests/eval/optimization_config.json",
});

export const ARTIFACT_PATHS = Object.freeze({
  validationReport: "artifacts/validation-report.json",
  validationReportMarkdown: "artifacts/VALIDATION_REPORT.md",
  workspaceDoctor: "artifacts/workspace-doctor.json",
  workspaceDoctorMarkdown: "artifacts/WORKSPACE_DOCTOR.md",
  workspaceRepair: "artifacts/workspace-repair.json",
  workspaceRepairMarkdown: "artifacts/WORKSPACE_REPAIR.md",
  specCodeTrace: "artifacts/spec-code-trace.json",
  generatorFeedback: "artifacts/generator-feedback.json",
  previewReport: "artifacts/preview-report.json",
  promotionPacket: "artifacts/promotion-packet.json",
  promotionPacketMarkdown: "artifacts/PROMOTION_PACKET.md",
  graph: "artifacts/graph.json",
  graphMarkdown: "artifacts/GRAPH.md",
  deployPlan: "artifacts/deploy-plan.json",
  deployPlanMarkdown: "artifacts/DEPLOY_PLAN.md",
  publishPlan: "artifacts/publish-plan.json",
  publishPlanMarkdown: "artifacts/PUBLISH_PLAN.md",
  cloudTopology: "artifacts/cloud-topology.json",
});

export const DATA_PATHS = Object.freeze({
  dataPlan: "mock_data/plan/data-plan.json",
  sourceIntegrationPlan: "mock_data/plan/source-integration-plan.json",
  packageIndex: "mock_data/package-index.yaml",
  cloudDataManifest: "mock_data/cloud/cloud-data-manifest.json",
  toolRegistryPlan: "artifacts/tool-registry-plan.json",
  alloyDbPackage: "mock_data/oltp/alloydb/package.yaml",
  firestorePackage: "mock_data/oltp/firestore/package.yaml",
  bigtablePackage: "mock_data/oltp/bigtable/package.yaml",
  bigqueryPackage: "mock_data/olap/bigquery/package.yaml",
  gcsObjectPlan: "mock_data/blobs/object-plan.yaml",
});

export const REQUIRED_WORKSPACE_FILES = Object.freeze([
  WORKSPACE_PATHS.pipeline,
  WORKSPACE_PATHS.schema,
  WORKSPACE_PATHS.fixtureManifest,
  WORKSPACE_PATHS.tools,
  WORKSPACE_PATHS.agent,
  WORKSPACE_PATHS.pyproject,
  WORKSPACE_PATHS.smokeTest,
]);

export const WORKSPACE_STAGES = Object.freeze([
  "created",
  "generated",
  "validated",
  "harness_reviewed",
  "harness_refined",
  "previewed",
  "promotion_ready",
  "deploy_planned",
  "publish_planned",
  "deployed",
  "published",
]);

export const PROMOTION_POLICY = Object.freeze({
  validationRequired: true,
  specCodeTraceRequired: true,
  minHarnessSpecToCodeScore: 4,
  unresolvedHarnessGapClasses: ["specGaps", "toolGaps", "evalGaps"],
});

export const PROMOTION_SHARE_FILES = Object.freeze([
  ARTIFACT_PATHS.promotionPacketMarkdown,
  ARTIFACT_PATHS.promotionPacket,
  ARTIFACT_PATHS.validationReport,
  ARTIFACT_PATHS.specCodeTrace,
  ARTIFACT_PATHS.generatorFeedback,
  ARTIFACT_PATHS.previewReport,
  WORKSPACE_PATHS.workspaceManifest,
]);

export function workspacePath(workspaceDir, relPath) {
  return join(workspaceDir, relPath);
}

export function workspacePaths(workspaceDir, paths) {
  return Object.fromEntries(Object.entries(paths).map(([key, relPath]) => [key, workspacePath(workspaceDir, relPath)]));
}

export function workspaceFileExists(workspaceDir, relPath) {
  return existsSync(workspacePath(workspaceDir, relPath));
}

export async function readWorkspaceJson(workspaceDir, relPath, fallback = null) {
  try {
    return JSON.parse(await readFile(workspacePath(workspaceDir, relPath), "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return fallback;
    throw error;
  }
}

export async function readWorkspaceText(workspaceDir, relPath, fallback = "") {
  try {
    return await readFile(workspacePath(workspaceDir, relPath), "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return fallback;
    throw error;
  }
}

export async function writeWorkspaceJson(workspaceDir, relPath, value) {
  const path = workspacePath(workspaceDir, relPath);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  return path;
}

export async function writeWorkspaceText(workspaceDir, relPath, value) {
  const path = workspacePath(workspaceDir, relPath);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, value, "utf8");
  return path;
}

export function buildWorkspaceContractReport(workspaceDir) {
  const required = REQUIRED_WORKSPACE_FILES.map((relPath) => ({
    path: relPath,
    exists: workspaceFileExists(workspaceDir, relPath),
  }));
  return {
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    required,
    ok: required.every((item) => item.exists),
  };
}
