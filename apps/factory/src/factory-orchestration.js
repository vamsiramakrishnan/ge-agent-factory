import { ARTIFACT_PATHS, DATA_PATHS, WORKSPACE_PATHS } from "./workspace-contract.js";
import { FACTORY_STAGE_IDS as CONTROL_PLANE_FACTORY_STAGE_IDS } from "@ge/run-ledger/control-plane";

// Declarative retry CLASSIFICATIONS for each stage. IMPORTANT: these describe how
// a stage *may* safely be retried by an operator (or a future supervisor); they
// are metadata, NOT an automatic retry engine. Nothing currently re-executes a
// stage based on these values, so do not read them as a guarantee of automated
// recovery. Using typed constants (instead of free-text strings) keeps the set
// honest and prevents drift — the test suite asserts every stage uses one.
export const RETRY_POLICIES = Object.freeze({
  SAFE: "safe",
  IDEMPOTENT_RESOURCE_UPSERT: "idempotent_resource_upsert",
  OPERATION_AWARE: "operation_aware",
  SAFE_REPLACE_WORKSPACE_BEFORE_CLOUD_SIDE_EFFECTS: "safe_replace_workspace_before_cloud_side_effects",
});

export const RETRY_POLICY_VALUES = new Set(Object.values(RETRY_POLICIES));

export const FACTORY_STAGE_GRAPH = [
  {
    id: "plan",
    label: "Plan",
    retry: RETRY_POLICIES.SAFE,
    owner: "control_plane",
    artifacts: ["factory-plan.json"],
  },
  {
    id: "generate_workspace",
    label: "Generate Workspace",
    retry: RETRY_POLICIES.SAFE_REPLACE_WORKSPACE_BEFORE_CLOUD_SIDE_EFFECTS,
    owner: "cloud_run_service",
    artifacts: [WORKSPACE_PATHS.workspaceManifest, WORKSPACE_PATHS.agent, WORKSPACE_PATHS.pyproject],
  },
  {
    id: "generate_data",
    label: "Generate Data",
    retry: RETRY_POLICIES.SAFE,
    owner: "cloud_run_service",
    artifacts: [WORKSPACE_PATHS.fixtureManifest, "mock_data/snowfakery/structured.recipe.yml"],
  },
  {
    id: "package_data",
    label: "Package Data",
    retry: RETRY_POLICIES.SAFE,
    owner: "cloud_run_service",
    artifacts: [DATA_PATHS.packageIndex, DATA_PATHS.cloudDataManifest, "mock_data/cloud/mcp-tools.json"],
  },
  {
    id: "harness_refine",
    label: "Harness Refine (Antigravity)",
    retry: RETRY_POLICIES.SAFE,
    owner: "cloud_run_service",
    // Antigravity review+refine with the best ADK skills, then re-validated by the
    // next stage. Gated to degrade to deterministic code when Vertex is unavailable,
    // so it never blocks the pipeline. Parity with the local harness lifecycle.
    artifacts: ["artifacts/harness-review.json", "artifacts/harness-refine.json"],
  },
  {
    id: "validate",
    label: "Validate",
    retry: RETRY_POLICIES.SAFE,
    owner: "cloud_build",
    artifacts: [ARTIFACT_PATHS.validationReport],
  },
  {
    id: "preview",
    label: "Preview",
    retry: RETRY_POLICIES.SAFE,
    owner: "cloud_build",
    artifacts: [ARTIFACT_PATHS.previewReport],
  },
  {
    id: "plan_deploy",
    label: "Plan Deploy",
    retry: RETRY_POLICIES.SAFE,
    owner: "control_plane",
    artifacts: [ARTIFACT_PATHS.deployPlan, ARTIFACT_PATHS.cloudTopology],
  },
  {
    id: "load_data",
    label: "Load Data",
    retry: RETRY_POLICIES.IDEMPOTENT_RESOURCE_UPSERT,
    owner: "cloud_run_service",
    artifacts: ["mock_data/cloud/load-report.json"],
  },
  {
    id: "deploy_runtime",
    label: "Deploy Runtime",
    retry: RETRY_POLICIES.OPERATION_AWARE,
    owner: "cloud_build",
    artifacts: ["deployment_metadata.json"],
  },
  {
    id: "poll_runtime",
    label: "Poll Runtime",
    retry: RETRY_POLICIES.SAFE,
    owner: "cloud_tasks",
    artifacts: ["deployment_metadata.json"],
  },
  {
    id: "register_tools",
    label: "Register Tools",
    retry: RETRY_POLICIES.IDEMPOTENT_RESOURCE_UPSERT,
    owner: "cloud_run_service",
    artifacts: ["agent_registry_registration.json"],
  },
  {
    id: "publish_enterprise",
    label: "Publish Enterprise",
    retry: RETRY_POLICIES.IDEMPOTENT_RESOURCE_UPSERT,
    owner: "cloud_build",
    artifacts: ["gemini_enterprise_registration.json"],
  },
  {
    id: "verify_live",
    label: "Verify Live",
    retry: RETRY_POLICIES.SAFE,
    owner: "cloud_run_service",
    artifacts: ["artifacts/live-verification-report.json"],
  },
];

const graphStageIds = FACTORY_STAGE_GRAPH.map((stage) => stage.id);
if (graphStageIds.join("\0") !== CONTROL_PLANE_FACTORY_STAGE_IDS.join("\0")) {
  throw new Error("FACTORY_STAGE_GRAPH ids drifted from @ge/run-ledger/control-plane");
}
export const FACTORY_STAGE_IDS = CONTROL_PLANE_FACTORY_STAGE_IDS;

export function nextFactoryStage(stageId) {
  const idx = FACTORY_STAGE_IDS.indexOf(stageId);
  if (idx < 0 || idx === FACTORY_STAGE_IDS.length - 1) return null;
  return FACTORY_STAGE_IDS[idx + 1];
}

export function factoryStageStatus({ currentStage, targetStage, completed = [] } = {}) {
  const targetIdx = FACTORY_STAGE_IDS.indexOf(targetStage || FACTORY_STAGE_IDS.at(-1));
  const currentIdx = FACTORY_STAGE_IDS.indexOf(currentStage || FACTORY_STAGE_IDS[0]);
  const completedSet = new Set(completed);
  return FACTORY_STAGE_GRAPH
    .slice(0, targetIdx >= 0 ? targetIdx + 1 : FACTORY_STAGE_GRAPH.length)
    .map((stage, index) => ({
      ...stage,
      status: completedSet.has(stage.id)
        ? "done"
        : index === currentIdx
          ? "running"
          : index < currentIdx
            ? "skipped_or_missing"
            : "pending",
    }));
}

export function buildControlPlanePlan({
  project,
  projectNumber,
  region = "us-central1",
  bucket,
  queue = "ge-agent-factory-stages",
  topic = "ge-agent-factory-events",
  workerService = "ge-agent-factory-worker",
  buildTrigger = "ge-agent-factory-stage-build",
  serviceAccount = "ge-agent-factory-runner",
} = {}) {
  const bucketName = bucket || `${project || "PROJECT_ID"}-ge-agent-factory`;
  const serviceAccountEmail = `${serviceAccount}@${project || "PROJECT_ID"}.iam.gserviceaccount.com`;
  const requiredApis = [
    "run.googleapis.com",
    "cloudtasks.googleapis.com",
    "pubsub.googleapis.com",
    "firestore.googleapis.com",
    "storage.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "aiplatform.googleapis.com",
    "discoveryengine.googleapis.com",
    "agentregistry.googleapis.com",
  ];
  const commands = [
    `gcloud services enable ${requiredApis.join(" ")} --project ${project}`,
    `gcloud iam service-accounts describe ${serviceAccountEmail} --project ${project} >/dev/null 2>&1 || gcloud iam service-accounts create ${serviceAccount} --display-name "GE Agent Factory Runner" --project ${project}`,
    `gcloud pubsub topics describe ${topic} --project ${project} >/dev/null 2>&1 || gcloud pubsub topics create ${topic} --project ${project}`,
    `gcloud tasks queues describe ${queue} --location ${region} --project ${project} >/dev/null 2>&1 || gcloud tasks queues create ${queue} --location ${region} --project ${project}`,
    `gcloud storage buckets describe gs://${bucketName} >/dev/null 2>&1 || gcloud storage buckets create gs://${bucketName} --location ${region} --project ${project}`,
    `gcloud builds triggers describe ${buildTrigger} --region ${region} --project ${project} >/dev/null 2>&1 || echo "Create ${buildTrigger} from repo connection; release stages are executed by Cloud Build via the factory worker"`,
  ];
  const provisionSteps = buildControlPlaneProvisionSteps({
    project,
    region,
    bucket: bucketName,
    queue,
    topic,
    workerService,
    buildTrigger,
    serviceAccount,
    serviceAccountEmail,
    requiredApis,
  });

  return {
    kind: "ge.agent_factory.control_plane",
    version: 1,
    project,
    projectNumber: projectNumber || null,
    region,
    services: {
      firestore: { database: "(default)", purpose: "durable run, stage, workspace, lock, and approval state" },
      pubsub: { topic, purpose: "fanout of run and stage events to UI/API subscribers" },
      cloudTasks: { queue, purpose: "durable per-stage execution queue with retries and rate limits" },
      cloudRunService: {
        workerService,
        purpose: "warm synchronous execution for generation, package, data loading, registration, and verification stages",
        status: "ready_after_provision",
      },
      gcs: { bucket: bucketName, purpose: "immutable artifacts, logs, bundles, and promotion packets" },
      cloudBuild: {
        trigger: buildTrigger,
        purpose: "source build, deploy, publish, and release stages with build logs, provenance, and long-running toolchain isolation",
        ownsStages: FACTORY_STAGE_GRAPH.filter((stage) => stage.owner === "cloud_build").map((stage) => stage.id),
      },
      secretManager: { purpose: "runtime credentials and environment secrets" },
    },
    identity: {
      serviceAccount,
      serviceAccountEmail,
      minimumRoles: [
        "roles/datastore.user",
        "roles/pubsub.publisher",
        "roles/cloudtasks.enqueuer",
        "roles/storage.objectAdmin",
        "roles/run.developer",
        "roles/run.invoker",
        "roles/cloudbuild.builds.editor",
        "roles/serviceusage.serviceUsageConsumer",
        "roles/artifactregistry.writer",
        "roles/aiplatform.user",
        "roles/discoveryengine.editor",
        "roles/secretmanager.secretAccessor",
      ],
    },
    stages: FACTORY_STAGE_GRAPH,
    provisionSteps,
    commands,
  };
}

export function buildOrchestrationCommand(options = {}) {
  return buildControlPlanePlan(options).commands;
}

export function buildControlPlaneProvisionSteps({
  project,
  region = "us-central1",
  bucket,
  queue = "ge-agent-factory-stages",
  topic = "ge-agent-factory-events",
  workerService = "ge-agent-factory-worker",
  buildTrigger = "ge-agent-factory-stage-build",
  serviceAccount = "ge-agent-factory-runner",
  serviceAccountEmail = `${serviceAccount}@${project}.iam.gserviceaccount.com`,
  requiredApis = [],
} = {}) {
  const bucketName = bucket || `${project}-ge-agent-factory`;
  const roles = [
    "roles/datastore.user",
    "roles/pubsub.publisher",
    "roles/cloudtasks.enqueuer",
    "roles/storage.objectAdmin",
    "roles/bigquery.jobUser",
    "roles/bigquery.dataEditor",
    "roles/run.developer",
    "roles/run.invoker",
    "roles/cloudbuild.builds.editor",
    "roles/serviceusage.serviceUsageConsumer",
    "roles/artifactregistry.writer",
    "roles/aiplatform.user",
    "roles/discoveryengine.editor",
    "roles/secretmanager.secretAccessor",
    "roles/iam.serviceAccountUser",
  ];

  return [
    {
      id: "enable-apis",
      kind: "gcloud",
      description: "Enable managed-service APIs required by the factory control plane.",
      check: ["services", "list", "--enabled", "--project", project, "--format=value(config.name)"],
      apply: ["services", "enable", ...requiredApis, "--project", project],
    },
    {
      id: "service-account",
      kind: "gcloud",
      description: "Create the factory runner service account if missing.",
      check: ["iam", "service-accounts", "describe", serviceAccountEmail, "--project", project],
      apply: ["iam", "service-accounts", "create", serviceAccount, "--display-name", "GE Agent Factory Runner", "--project", project],
      ignoreCheckFailure: true,
      createIfMissing: true,
    },
    ...roles.map((role) => ({
      id: `iam-${role.split("/").at(-1).replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`,
      kind: "gcloud",
      description: `Grant ${role} to the factory runner service account.`,
      apply: [
        "projects", "add-iam-policy-binding", project,
        "--member", `serviceAccount:${serviceAccountEmail}`,
        "--role", role,
        "--condition=None",
      ],
    })),
    {
      id: "pubsub-topic",
      kind: "gcloud",
      description: "Create the factory event fanout topic.",
      check: ["pubsub", "topics", "describe", topic, "--project", project],
      apply: ["pubsub", "topics", "create", topic, "--project", project],
      ignoreCheckFailure: true,
      createIfMissing: true,
    },
    {
      id: "tasks-queue",
      kind: "gcloud",
      description: "Create the durable per-stage Cloud Tasks queue.",
      check: ["tasks", "queues", "describe", queue, "--location", region, "--project", project],
      apply: ["tasks", "queues", "create", queue, "--location", region, "--project", project],
      ignoreCheckFailure: true,
      createIfMissing: true,
    },
    {
      id: "artifact-bucket",
      kind: "gcloud",
      description: "Create the immutable artifact bucket.",
      check: ["storage", "buckets", "describe", `gs://${bucketName}`],
      apply: ["storage", "buckets", "create", `gs://${bucketName}`, "--location", region, "--project", project],
      ignoreCheckFailure: true,
      createIfMissing: true,
    },
    {
      // Deliberately NOT a gcloud step (taste-campaign 09 §C8): a stale
      // `gcloud run deploy` spec used to live here (2Gi/2CPU + inline env) and
      // drifted against Terraform's worker config (installer/terraform/cloud_run.tf:
      // 8 CPU / 32Gi, env, scaling, ingress, SA). Terraform is the sole owner of
      // Cloud Run config per the deploy contract in docs/OPERATIONS.md ("Cloud Build
      // builds images; Terraform owns Cloud Run config"), so this step only surfaces
      // the pointer instead of deploying a conflicting spec. executeProvisionSteps
      // reports it as skipped-with-description.
      id: "worker-service",
      kind: "note",
      description: `Cloud Run worker service ${workerService} is Terraform-owned (installer/terraform/cloud_run.tf) — deploy/update it with \`ge images build\` + \`ge infra apply\` (run by \`ge up\`), never \`gcloud run deploy\`. See docs/OPERATIONS.md "Deploy contract".`,
    },
    {
      id: "cloud-build-stage-template",
      kind: "artifact",
      description: "Cloud Build release stages use cloudbuild.factory-stage.yaml. The factory worker dispatches these stages; operators should not run deploy or publish directly.",
      path: "cloudbuild.factory-stage.yaml",
      triggerName: buildTrigger,
    },
  ];
}
