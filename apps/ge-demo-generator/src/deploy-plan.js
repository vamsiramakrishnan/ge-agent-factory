import { ARTIFACT_PATHS, DATA_PATHS, WORKSPACE_PATHS } from "./workspace-contract.js";

export function safeCloudName(value, fallback = "workspace") {
  const slug = String(value || fallback).replace(/[^a-z0-9]+/gi, "_").toLowerCase().replace(/^_+|_+$/g, "");
  return slug || fallback;
}

function conditionalLoad(path, label) {
  return `if [ -f ${path} ]; then bash ${path}; else echo 'No ${label} package for this use case'; fi`;
}

function group(id, title, commands, note = "") {
  return { id, title, commands, ...(note ? { note } : {}) };
}

export function buildGoogleCloudCommandGroups({
  projectId,
  workspaceDir,
  target = "agent_runtime",
  appId = "<GEMINI_ENTERPRISE_APP_ID>",
} = {}) {
  const safeId = safeCloudName(projectId);
  const workspaceDataset = `ge_${safeId}`;
  const sharedPrefix = "${GE_ENVIRONMENT:-dev}";
  return [
    group("local_gates", "Local gates", [
      `ge validate ${projectId}`,
      `ge preview ${projectId}`,
      `cd ${workspaceDir} && agents-cli install`,
      `cd ${workspaceDir} && agents-cli info --json > artifacts/agents-cli-info.json`,
      `cd ${workspaceDir} && agents-cli lint --fix --skip-codespell --skip-ty`,
      `cd ${workspaceDir} && agents-cli run "hello" --start-server`,
      `cd ${workspaceDir} && agents-cli eval run --all`,
      `cd ${workspaceDir} && ge-mock quality-gate --dir . --prompt "hello"`,
      `ge promote:packet ${projectId}`,
    ], "Use agents-cli for the canonical local agent smoke path and behavior evals; ge commands remain harness wrappers."),
    group("datastore_plan", "Plan datastore collection", [
      "export GOOGLE_CLOUD_PROJECT=\"<GCP_PROJECT>\"",
      "export LOCATION=\"${GOOGLE_CLOUD_LOCATION:-us-central1}\"",
      "export AGENT_LOCATION=\"${GOOGLE_GENAI_LOCATION:-global}\"",
      "export GE_ENVIRONMENT=\"${GE_ENVIRONMENT:-dev}\"",
      `export BQ_DATASET="${workspaceDataset}"`,
      "export GCS_BUCKET=\"${GOOGLE_CLOUD_PROJECT}-ge-mock-data\"",
      `export GCS_PREFIX="ge-mock/${sharedPrefix}/$BQ_DATASET"`,
      "export ALLOYDB_CLUSTER=\"${GE_ENVIRONMENT}-ge-alloydb\"",
      "export ALLOYDB_INSTANCE=\"${GE_ENVIRONMENT}-ge-alloydb-primary\"",
      `export ALLOYDB_DATABASE="${workspaceDataset}"`,
      "export BIGTABLE_INSTANCE=\"${GE_ENVIRONMENT}-ge-events\"",
      "export BIGTABLE_TABLE=\"ge_mock_events\"",
      `export FIRESTORE_COLLECTION_PREFIX="ge_mock/${safeId}"`,
      `ge-mock plan-data --dir ${workspaceDir}`,
      `ge-mock snowfakery-recipe --dir ${workspaceDir}`,
    ], "Creates datastore collection plans, Snowfakery recipes, OLTP/OLAP package manifests, and blob package manifests. Scaling model: one Google Cloud project; shared AlloyDB/Firestore/Bigtable/GCS services; per-workspace database, dataset, collection prefix, row-key prefix, and object prefix."),
    group("oltp_alloydb", "Load OLTP SQL to AlloyDB", [
      "gcloud services enable alloydb.googleapis.com --project \"$GOOGLE_CLOUD_PROJECT\"",
      "gcloud alloydb clusters describe \"$ALLOYDB_CLUSTER\" --region \"$LOCATION\" --project \"$GOOGLE_CLOUD_PROJECT\" >/dev/null 2>&1 || echo \"Create shared AlloyDB cluster $ALLOYDB_CLUSTER once for this project/environment\"",
      "export ALLOYDB_POSTGRES_DSN=\"postgresql://<user>:<password>@<alloydb-private-ip>:5432/${ALLOYDB_DATABASE}\"",
      `cd ${workspaceDir}`,
      conditionalLoad("mock_data/oltp/alloydb/load-alloydb.sh", "AlloyDB"),
    ], "AlloyDB uses one shared cluster/instance per project/environment and one PostgreSQL database per generated agent workspace."),
    group("oltp_firestore", "Load OLTP NoSQL to Firestore/Firebase", [
      "gcloud services enable firestore.googleapis.com --project \"$GOOGLE_CLOUD_PROJECT\"",
      "gcloud firestore databases describe --database=\"(default)\" --project \"$GOOGLE_CLOUD_PROJECT\" >/dev/null 2>&1 || gcloud firestore databases create --database=\"(default)\" --location=\"$LOCATION\" --project \"$GOOGLE_CLOUD_PROJECT\"",
      `cd ${workspaceDir}`,
      conditionalLoad("mock_data/oltp/firestore/load-firestore.sh", "Firestore/Firebase"),
    ], "Firestore uses the shared project database with per-workspace collection prefixes such as $FIRESTORE_COLLECTION_PREFIX."),
    group("oltp_bigtable", "Load high-volume NoSQL to Bigtable", [
      "gcloud services enable bigtable.googleapis.com bigtableadmin.googleapis.com --project \"$GOOGLE_CLOUD_PROJECT\"",
      "gcloud bigtable instances describe \"$BIGTABLE_INSTANCE\" --project \"$GOOGLE_CLOUD_PROJECT\" >/dev/null 2>&1 || gcloud bigtable instances create \"$BIGTABLE_INSTANCE\" --project \"$GOOGLE_CLOUD_PROJECT\" --cluster=\"${BIGTABLE_INSTANCE}-c1\" --cluster-zone=\"${LOCATION}-a\" --display-name=\"$BIGTABLE_INSTANCE\"",
      `cd ${workspaceDir}`,
      conditionalLoad("mock_data/oltp/bigtable/load-bigtable.sh", "Bigtable"),
    ], "Bigtable uses one shared instance/table per project/environment with workspace row-key prefixes."),
    group("olap_bigquery_gcs", "Load OLAP and blobs to BigQuery + Cloud Storage", [
      `ge-mock data-plan --dir ${workspaceDir} --project "$GOOGLE_CLOUD_PROJECT" --location "$LOCATION" --dataset "$BQ_DATASET" --bucket "$GCS_BUCKET"`,
      `cd ${workspaceDir}`,
      "if [ -f mock_data/cloud/load-to-google-cloud.sh ]; then bash mock_data/cloud/load-to-google-cloud.sh; else echo 'No BigQuery/GCS cloud package generated yet'; fi",
    ], "BigQuery is for analytical facts/snapshots. Cloud Storage holds PDF/DOCX/blob evidence with a BigQuery documents_manifest table."),
    group("agent_tools", "Deploy ADK agent and tools", [
      `cd ${workspaceDir}`,
      `agents-cli scaffold enhance . --deployment-target ${target} --agent-directory app --yes`,
      `agents-cli deploy --project "$GOOGLE_CLOUD_PROJECT" --region "$LOCATION" --no-confirm-project --dry-run`,
      `agents-cli deploy --project "$GOOGLE_CLOUD_PROJECT" --region "$LOCATION" --no-confirm-project --no-wait`,
      `ge-mock deploy-status --dir ${workspaceDir} --project "$GOOGLE_CLOUD_PROJECT" --region "$LOCATION"`,
      `ge-mock verify-live --dir ${workspaceDir} --prompt "hello"`,
    ], "ADK function tools in app/tools.py are deployed with the agent package. ge-mock deploy is a compatibility wrapper around this agents-cli path."),
    group("registry", "Register for Gemini Enterprise", [
      `ge-mock register --dir ${workspaceDir} --project "$GOOGLE_CLOUD_PROJECT" --region "$LOCATION" --as adk`,
    ]),
    group("registry_publish", "Register and publish", [
      `cd ${workspaceDir}`,
      `agents-cli publish gemini-enterprise --metadata-file deployment_metadata.json --project-id "$GOOGLE_CLOUD_PROJECT" --gemini-enterprise-app-id ${appId} --registration-type adk`,
    ], "Use only after explicit approval to publish. Register MCP servers separately only when the source system exposes an MCP endpoint/toolset."),
  ];
}

export function flattenCommands(commandGroups, includeRegistry = false) {
  return commandGroups
    .filter((item) => includeRegistry || item.id !== "registry_publish")
    .flatMap((item) => item.commands || []);
}

export function buildDeployPlan({ projectId, workspaceDir, readiness, target = "agent_runtime", generatedAt = new Date().toISOString() }) {
  const commandGroups = buildGoogleCloudCommandGroups({ projectId, workspaceDir, target });
  const deployGroups = commandGroups.filter((item) => item.id !== "registry_publish");
  return {
    workspace: projectId,
    target,
    mode: "plan_only",
    generatedAt,
    prerequisites: ["promotion packet ready", "gcloud authenticated", "Google Cloud project selected", "required APIs enabled", "local validation passing"],
    evidence: [ARTIFACT_PATHS.promotionPacket, ARTIFACT_PATHS.validationReport, ARTIFACT_PATHS.previewReport],
    commands: flattenCommands(deployGroups),
    commandGroups: deployGroups,
    readiness,
    mutations: target === "cloud_run"
      ? ["Cloud Run service create/update", "container/source build", "optional Agent Registry service"]
      : ["Agent Runtime deployment", "deployment_metadata.json update"],
  };
}

export function buildPublishPlan({ projectId, workspaceDir, readiness, appId = "<GEMINI_ENTERPRISE_APP_ID>", generatedAt = new Date().toISOString() }) {
  return {
    workspace: projectId,
    mode: "plan_only",
    appId,
    generatedAt,
    prerequisites: ["deploy plan reviewed", "deployment target selected", "Gemini Enterprise app id known", "explicit publish approval"],
    evidence: [ARTIFACT_PATHS.promotionPacket, ARTIFACT_PATHS.deployPlan],
    commands: [
      `ge deploy:plan ${projectId}`,
      `cd ${workspaceDir}`,
      `agents-cli publish gemini-enterprise --metadata-file deployment_metadata.json --project-id "$GOOGLE_CLOUD_PROJECT" --gemini-enterprise-app-id ${appId} --registration-type adk`,
    ],
    commandGroups: [
      buildGoogleCloudCommandGroups({ projectId, workspaceDir, appId }).find((item) => item.id === "registry_publish"),
    ].filter(Boolean),
    readiness,
    mutations: ["Gemini Enterprise agent registration/update"],
  };
}

function statusFromReadiness(readiness, key) {
  const status = readiness?.[key]?.status || "missing";
  if (["ready", "passing", "running"].includes(status)) return "ready";
  if (["created", "available"].includes(status)) return "available";
  return "missing";
}

function graphNode(id, label, status, path = null, detail = "") {
  return { id, label, status, path, detail };
}

export function buildDeliveryGraph({ workspace, readiness = {}, evidence = {} } = {}) {
  const nodes = [
    graphNode("workspace", "Workspace", "ready", WORKSPACE_PATHS.workspaceManifest, workspace?.id || ""),
    graphNode("mock_data", "Mock Data", statusFromReadiness(readiness, "mockData"), WORKSPACE_PATHS.fixtureManifest, evidence.fixtures?.summary || ""),
    graphNode("agent", "ADK Agent + Tools", statusFromReadiness(readiness, "agent"), WORKSPACE_PATHS.agent, readiness.agent?.entrypoint || ""),
    graphNode("tests", "Validation Gates", statusFromReadiness(readiness, "tests"), ARTIFACT_PATHS.validationReport, evidence.validation?.summary || ""),
    graphNode("preview", "ADK Run Preview", statusFromReadiness(readiness, "localPreview"), ARTIFACT_PATHS.previewReport, evidence.preview?.summary || ""),
    graphNode("packet", "Promotion Packet", "ready", ARTIFACT_PATHS.promotionPacket, "shareable handoff"),
    graphNode("data_plan", "Datastore Plan", evidence.dataStorePlan?.ok || evidence.cloudDataPlan?.ok ? "ready" : "available", DATA_PATHS.dataPlan, "AlloyDB + Firestore + Bigtable + BigQuery + GCS"),
    graphNode("alloydb", "OLTP SQL: AlloyDB", evidence.alloyDbPackage?.ok ? "available" : "missing", DATA_PATHS.alloyDbPackage, "transactional source records"),
    graphNode("firestore", "OLTP NoSQL: Firestore/Firebase", evidence.firestorePackage?.ok ? "available" : "missing", DATA_PATHS.firestorePackage, "document records and workflow state"),
    graphNode("bigtable", "OLTP NoSQL: Bigtable", evidence.bigtablePackage?.ok ? "available" : "missing", DATA_PATHS.bigtablePackage, "high-volume events/time series"),
    graphNode("bigquery", "OLAP: BigQuery", evidence.cloudDataPlan?.ok ? "ready" : evidence.bigqueryPackage?.ok ? "available" : "missing", DATA_PATHS.bigqueryPackage, "facts, snapshots, analytics"),
    graphNode("gcs", "Unstructured: Cloud Storage", evidence.cloudDataPlan?.ok ? "ready" : evidence.gcsPackage?.ok ? "available" : "missing", DATA_PATHS.gcsObjectPlan, "PDF/DOCX/blob evidence"),
    graphNode("deploy_plan", "Deploy Plan", evidence.deployPlan?.ok ? "ready" : statusFromReadiness(readiness, "deployPlan"), ARTIFACT_PATHS.deployPlan, evidence.deployPlan?.summary || ""),
    graphNode("publish_plan", "Publish Plan", evidence.publishPlan?.ok ? "ready" : statusFromReadiness(readiness, "publishPlan"), ARTIFACT_PATHS.publishPlan, evidence.publishPlan?.summary || ""),
    graphNode("agent_runtime", "Agent Runtime", statusFromReadiness(readiness, "deployment"), "deployment_metadata.json", readiness.deployment?.runtimeId || ""),
    graphNode("enterprise", "Gemini Enterprise", statusFromReadiness(readiness, "published"), "gemini_enterprise_registration.json", readiness.published?.appId || ""),
  ];
  const edges = [
    ["workspace", "mock_data"],
    ["workspace", "agent"],
    ["mock_data", "tests"],
    ["agent", "tests"],
    ["tests", "preview"],
    ["preview", "packet"],
    ["packet", "data_plan"],
    ["data_plan", "alloydb"],
    ["data_plan", "firestore"],
    ["data_plan", "bigtable"],
    ["data_plan", "bigquery"],
    ["data_plan", "gcs"],
    ["alloydb", "deploy_plan"],
    ["firestore", "deploy_plan"],
    ["bigtable", "deploy_plan"],
    ["bigquery", "deploy_plan"],
    ["gcs", "deploy_plan"],
    ["packet", "deploy_plan"],
    ["deploy_plan", "publish_plan"],
    ["deploy_plan", "agent_runtime"],
    ["agent_runtime", "enterprise"],
    ["publish_plan", "enterprise"],
  ].map(([from, to]) => ({ from, to }));
  return { nodes, edges };
}

export function renderMermaidGraph(graph) {
  const safeId = (value) => String(value).replace(/[^a-zA-Z0-9_]/g, "_");
  const lines = ["flowchart LR"];
  for (const node of graph.nodes) {
    const label = `${node.label}\\n${node.status}${node.path ? `\\n${node.path}` : ""}`;
    lines.push(`  ${safeId(node.id)}["${label.replace(/"/g, "'")}"]`);
  }
  for (const edge of graph.edges) lines.push(`  ${safeId(edge.from)} --> ${safeId(edge.to)}`);
  lines.push("  classDef ready fill:#d7f5e8,stroke:#2e7d5b,color:#17382c;");
  lines.push("  classDef available fill:#fff1c7,stroke:#a5751d,color:#3f2b08;");
  lines.push("  classDef missing fill:#f3f0e6,stroke:#bdb59f,color:#4c4637;");
  for (const node of graph.nodes) lines.push(`  class ${safeId(node.id)} ${node.status};`);
  return lines.join("\n");
}

export function renderGraphArtifact(packet) {
  return [
    "# Agent Delivery Graph",
    "",
    "```mermaid",
    packet.visualization?.mermaid || renderMermaidGraph(buildDeliveryGraph(packet)),
    "```",
    "",
    "## Nodes",
    ...(packet.visualization?.graph?.nodes || []).map((node) => `- ${node.label}: ${node.status}${node.path ? ` (${node.path})` : ""}${node.detail ? ` - ${node.detail}` : ""}`),
    "",
  ].join("\n");
}

export function renderPlanMarkdown(title, plan) {
  return [
    `# ${title}`,
    "",
    `Workspace: ${plan.workspace}`,
    `Mode: ${plan.mode}`,
    `Generated: ${plan.generatedAt}`,
    "",
    "## Evidence",
    ...(plan.evidence || []).map((item) => `- ${item}`),
    "",
    "## Prerequisites",
    ...(plan.prerequisites || []).map((item) => `- ${item}`),
    "",
    "## Commands",
    "```bash",
    ...(plan.commands || []),
    "```",
    "",
    ...(plan.commandGroups || []).flatMap((item) => [
      `## ${item.title}`,
      "```bash",
      ...(item.commands || []),
      "```",
      item.note ? `Note: ${item.note}` : "",
      "",
    ]),
    "## Mutations",
    ...(plan.mutations || []).map((item) => `- ${item}`),
    "",
  ].join("\n");
}
