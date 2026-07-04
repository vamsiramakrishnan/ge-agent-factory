import { posix as path } from "node:path";

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
  agentPassport: "artifacts/agent-passport.json",
  admissionDecision: "artifacts/admission-decision.json",
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

export const REQUIRED_WORKSPACE_COMMANDS = Object.freeze([
  "install",
  "run",
  "test",
  "validate",
  "doctor",
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

export function listWorkspacePathEntries() {
  return [
    ...Object.entries(WORKSPACE_PATHS).map(([key, relPath]) => ({ group: "workspace", key, path: relPath })),
    ...Object.entries(ARTIFACT_PATHS).map(([key, relPath]) => ({ group: "artifact", key, path: relPath })),
    ...Object.entries(DATA_PATHS).map(([key, relPath]) => ({ group: "data", key, path: relPath })),
  ];
}

export function isKnownWorkspacePath(relPath) {
  return listWorkspacePathEntries().some((entry) => entry.path === relPath);
}

export function assertRelativeWorkspacePath(relPath) {
  const value = String(relPath || "");
  if (!value || value.startsWith("/") || value.includes("\0")) {
    throw new Error(`invalid workspace-relative path: ${value || "<empty>"}`);
  }
  const normalized = path.normalize(value);
  if (normalized === "." || normalized.startsWith("../") || normalized === "..") {
    throw new Error(`workspace path escapes workspace root: ${value}`);
  }
  return normalized;
}

export function workspacePath(workspaceDir, relPath) {
  return path.join(String(workspaceDir), assertRelativeWorkspacePath(relPath));
}

export function workspacePaths(workspaceDir, paths) {
  return Object.fromEntries(
    Object.entries(paths).map(([key, relPath]) => [key, workspacePath(workspaceDir, relPath)]),
  );
}

export function requiredGeneratedWorkspaceFiles(manifest = {}) {
  const generated = Array.isArray(manifest.generatedFiles) ? manifest.generatedFiles : [];
  const required = generated
    .filter((item) => item?.required && item.path)
    .map((item) => item.path);
  return Array.from(new Set([
    WORKSPACE_PATHS.workspaceManifest,
    ...REQUIRED_WORKSPACE_FILES,
    ...required,
  ]));
}

export function buildWorkspaceManifestSchema() {
  return {
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    requiredCommands: [...REQUIRED_WORKSPACE_COMMANDS],
    requiredTopLevelFields: [
      "schemaVersion",
      "purpose",
      "agent",
      "commands",
      "registration",
      "generatedFiles",
    ],
    agent: ["runtime", "entrypoint"],
    registration: ["agentRegistryReady", "geminiEnterpriseReady"],
  };
}

export function createWorkspaceManifest({
  purpose,
  agent,
  commands,
  registration,
  generatedFiles = [],
  source = {},
  quality = {},
  ...rest
} = {}) {
  return {
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    purpose,
    agent,
    commands,
    registration,
    generatedFiles,
    source,
    quality,
    ...rest,
  };
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function check(id, ok, detail, level = "fail") {
  return { id, status: ok ? "pass" : level, detail };
}

export function validateWorkspaceManifestShape(manifest = {}) {
  const commands = manifest.commands || {};
  const missingCommands = REQUIRED_WORKSPACE_COMMANDS.filter((name) => !hasText(commands[name]));
  const generatedFiles = Array.isArray(manifest.generatedFiles) ? manifest.generatedFiles : [];
  const checks = [
    check(
      "manifest:schema_version",
      manifest.schemaVersion === WORKSPACE_SCHEMA_VERSION,
      manifest.schemaVersion === WORKSPACE_SCHEMA_VERSION
        ? `v${WORKSPACE_SCHEMA_VERSION}`
        : `expected v${WORKSPACE_SCHEMA_VERSION}, found ${manifest.schemaVersion ?? "missing"}`,
    ),
    check("manifest:purpose", hasText(manifest.purpose), hasText(manifest.purpose) ? manifest.purpose : "missing"),
    check(
      "manifest:agent",
      hasText(manifest.agent?.runtime) && hasText(manifest.agent?.entrypoint),
      hasText(manifest.agent?.runtime) && hasText(manifest.agent?.entrypoint)
        ? `${manifest.agent.runtime}:${manifest.agent.entrypoint}`
        : "agent.runtime or agent.entrypoint missing",
    ),
    check(
      "manifest:commands",
      missingCommands.length === 0,
      missingCommands.length ? `missing ${missingCommands.join(", ")}` : REQUIRED_WORKSPACE_COMMANDS.join(", "),
    ),
    check(
      "manifest:registration",
      typeof manifest.registration?.agentRegistryReady === "boolean"
        && typeof manifest.registration?.geminiEnterpriseReady === "boolean",
      manifest.registration
        ? `agentRegistryReady=${manifest.registration.agentRegistryReady}, geminiEnterpriseReady=${manifest.registration.geminiEnterpriseReady}`
        : "registration flags missing",
    ),
    check(
      "manifest:generated_files",
      generatedFiles.some((item) => item?.path === WORKSPACE_PATHS.workspaceManifest),
      generatedFiles.length ? `${generatedFiles.length} file entries` : "missing generatedFiles[]",
    ),
  ];
  return {
    ok: checks.every((item) => item.status === "pass"),
    checks,
    missingCommands,
    requiredFiles: requiredGeneratedWorkspaceFiles(manifest),
  };
}
