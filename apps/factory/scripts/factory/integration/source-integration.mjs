import { basename, join } from "node:path";
import { readJson, writeJson } from "@ge/std/json-io";
import { canonicalSystemId, safePyName, snakeCase } from "@ge/std/naming";
import { resolveGcpProject } from "@ge/std/gcp-config";
import { findSimulatorForSystem, loadSimulatorRegistry } from "../simulators/registry.mjs";
import { sourceTimestamp } from "../../../src/source-clock.js";

export const MANAGED_MCP_SERVICES = [
  { id: "bigquery", api: "bigquery.googleapis.com", description: "BigQuery SQL and schema tools" },
  { id: "spanner", api: "spanner.googleapis.com", description: "Spanner database tools" },
  { id: "maps", api: "mapstools.googleapis.com", description: "Maps places, routes, geocoding" },
  { id: "youtube", api: "youtube.googleapis.com", description: "YouTube data and search" },
  { id: "drive", api: "drive.googleapis.com", description: "Google Drive file access" },
  { id: "calendar", api: "calendar.googleapis.com", description: "Google Calendar events" },
  { id: "gmail", api: "gmail.googleapis.com", description: "Gmail messages" },
];

const MANAGED_MCP_BY_ID = new Map(MANAGED_MCP_SERVICES.map((service) => [service.id, service]));
const FIRST_PARTY_MCP_ALIASES = [
  { match: /bigquery|bq|analytics warehouse|warehouse|looker/i, services: ["bigquery"] },
  { match: /spanner/i, services: ["spanner"] },
  { match: /maps|places|geocod|route/i, services: ["maps"] },
  { match: /youtube/i, services: ["youtube"] },
  { match: /google drive|drive|google docs|docs|sheet|slides|workspace/i, services: ["drive"] },
  { match: /calendar|workspace/i, services: ["calendar"] },
  { match: /gmail|email|mail|workspace/i, services: ["gmail"] },
];

const DATASTORE_PROVISIONING = {
  alloydb: {
    requiredApis: ["alloydb.googleapis.com"],
    provisioner: "Google Cloud AlloyDB",
    adkPattern: "Custom Python function tools or registered custom MCP adapter over source API facade",
    registryPolicy: "register custom API/MCP adapter when exposed beyond local deterministic fixtures",
  },
  firestore: {
    requiredApis: ["firestore.googleapis.com"],
    provisioner: "Google Cloud Firestore",
    adkPattern: "Custom Python function tools for document lookup; custom MCP adapter for remote tool reuse",
    registryPolicy: "register custom MCP adapter if Firestore-backed tools are shared with deployed agents",
  },
  bigtable: {
    requiredApis: ["bigtable.googleapis.com", "bigtableadmin.googleapis.com"],
    provisioner: "Google Cloud Bigtable",
    adkPattern: "Custom Python function tools for keyed/time-series reads; custom MCP adapter for remote tool reuse",
    registryPolicy: "register custom MCP adapter if Bigtable-backed tools are shared with deployed agents",
  },
  bigquery: {
    requiredApis: ["bigquery.googleapis.com"],
    provisioner: "Google BigQuery",
    adkPattern: "Prefer first-party MCP via ApiRegistry.get_toolset(\"bigquery.googleapis.com\") for deployed SQL access",
    registryPolicy: "enable first-party BigQuery MCP; do not wrap BigQuery in custom MCP unless domain facade semantics are required",
  },
  gcs: {
    requiredApis: ["storage.googleapis.com"],
    provisioner: "Google Cloud Storage",
    adkPattern: "Custom citation/document tools over GCS object manifests; add Vertex AI Search/Discovery Engine when retrieval is required",
    registryPolicy: "register a custom MCP document adapter when object search/citation tools are exposed remotely",
  },
  vertex_ai: {
    requiredApis: ["aiplatform.googleapis.com"],
    provisioner: "Vertex AI",
    adkPattern: "ADK Agent Runtime / model runtime dependency",
    registryPolicy: "register ADK agent runtime, not as source-data MCP",
  },
  api: {
    requiredApis: ["run.googleapis.com", "artifactregistry.googleapis.com", "apigateway.googleapis.com"],
    provisioner: "Cloud Run/API Gateway source adapter",
    adkPattern: "Agent Registry MCP toolset for remote adapters, local function tools for fixture-only development",
    registryPolicy: "register Cloud Run adapter as MCP server in Agent Registry after deployment",
  },
};

function uniq(values) {
  return Array.from(new Set((values || []).filter(Boolean)));
}

function datastoreProvisioningFor(value) {
  return DATASTORE_PROVISIONING[String(value || "").toLowerCase()] || DATASTORE_PROVISIONING.api;
}

function managedMcpMatchesForSource(source = {}) {
  const text = `${source.id || ""} ${source.name || ""} ${source.system || ""} ${source.protocol || ""} ${source.description || ""} ${source.sourceKind || ""}`.toLowerCase();
  const ids = [];
  for (const rule of FIRST_PARTY_MCP_ALIASES) {
    if (rule.match.test(text)) ids.push(...rule.services);
  }
  return uniq(ids).map((id) => MANAGED_MCP_BY_ID.get(id)).filter(Boolean);
}

function normalizePlanSources({ manifest, dataPlan }) {
  const fromDataPlan = (dataPlan?.sources || []).map((source) => ({
    id: canonicalSystemId(source.system),
    name: source.system,
    protocol: source.protocol || "fixture",
    direction: source.direction || "read",
    sourceKind: source.sourceKind || null,
    description: source.description || "",
    datastores: [source.target?.datastore].filter(Boolean),
    entities: source.entities || [],
  }));
  const fromManifest = (manifest?.systems || []).map((source) => ({
    id: source.id || canonicalSystemId(source.name),
    name: source.name || source.id,
    protocol: source.protocol || "fixture",
    direction: source.direction || "read",
    sourceKind: null,
    description: source.responsibility || source.description || "",
    datastores: source.localBacking || [],
    entities: source.owns || [],
  }));
  const combined = [...fromDataPlan, ...fromManifest];
  return Array.from(combined.reduce((map, source) => {
    const id = source.id || canonicalSystemId(source.name);
    const key = String(id || source.name || "").replace(/_/g, "").toLowerCase();
    if (!map.has(key)) map.set(key, { ...source, id, datastores: [], entities: [] });
    const existing = map.get(key);
    if (String(id).length < String(existing.id || "").length || String(existing.id || "").includes("_")) existing.id = id;
    existing.name = existing.name || source.name;
    existing.protocol = existing.protocol === "fixture" ? source.protocol : existing.protocol;
    existing.direction = existing.direction || source.direction;
    existing.sourceKind = existing.sourceKind || source.sourceKind;
    existing.description = existing.description || source.description;
    existing.datastores = uniq([...(existing.datastores || []), ...(source.datastores || [])]);
    existing.entities = uniq([...(existing.entities || []), ...(source.entities || [])]);
    return map;
  }, new Map()).values());
}

function pipelinePath(dir) {
  return join(dir, "mock_systems", "pipeline.json");
}

async function loadPipeline(dir) {
  return readJson(pipelinePath(dir), {
    name: basename(dir),
    domain: "general",
    createdAt: null,
    steps: {},
    currentStep: null,
  });
}

async function savePipeline(dir, pipeline) {
  await writeJson(pipelinePath(dir), pipeline);
}

function markStep(pipeline, step, status, meta = {}) {
  pipeline.steps[step] = { status, completedAt: new Date().toISOString(), ...meta };
  pipeline.currentStep = step;
}

export async function buildSourceIntegrationPlan(dir, flags = {}, opts = {}) {
  const pipeline = await loadPipeline(dir);
  const generatedAt = sourceTimestamp();
  const project = resolveGcpProject({ explicit: flags.project }) || "<gcp-project>";
  const location = flags.location || flags.region || process.env.GOOGLE_CLOUD_LOCATION || "global";
  const manifest = await readJson(join(dir, "fixtures", "manifest.json"), null);
  const dataPlan = opts.dataPlan || await readJson(join(dir, "mock_data", "plan", "data-plan.json"), null);
  const apiContract = await readJson(join(dir, "mock_data", "apis", "source-adapters.json"), null);
  const cloudPlan = opts.cloudPlan || await readJson(join(dir, "mock_data", "cloud", "cloud-data-manifest.json"), null);
  const sources = normalizePlanSources({ manifest, dataPlan });
  const simulatorRegistry = loadSimulatorRegistry();
  const adapterServiceName = apiContract?.id || `${snakeCase(pipeline.name || basename(dir))}-source-adapters`;
  const outDir = join(dir, "mock_data", "plan");

  const sourceIntegrations = sources.map((source) => {
    const datastores = source.datastores.length ? source.datastores : ["api"];
    const firstParty = managedMcpMatchesForSource(source);
    const simulator = findSimulatorForSystem(source.id || source.name, simulatorRegistry);
    const datastorePlans = datastores.map((datastore) => ({
      datastore,
      ...datastoreProvisioningFor(datastore),
    }));
    const hasFirstParty = firstParty.length > 0;
    const customMcpNeeded = !hasFirstParty || datastores.some((datastore) => !["bigquery", "vertex_ai"].includes(datastore));
    const firstPartyUsage = firstParty.map((service) => ({
      service: service.id,
      api: service.api,
      description: service.description,
      enableCommand: `gcloud services enable ${service.api} --project ${project}`,
      adkUsage: [
        "from google.adk.auth.credential_manager import CredentialManager",
        "from google.adk.integrations.agent_identity import GcpAuthProvider",
        "from google.adk.integrations.agent_registry import AgentRegistry",
        "CredentialManager.register_auth_provider(GcpAuthProvider())  # ADC / agent identity",
        `registry = AgentRegistry(project_id="${project}", location="${location}")`,
        `# First-party Google MCP (auto-registered when the API is enabled).`,
        `${safePyName(service.id)}_tools = registry.get_mcp_toolset(mcp_server_name="mcpServers/${service.id}")`,
      ].join("\n"),
    }));
    return {
      id: source.id,
      name: source.name,
      protocol: source.protocol,
      direction: source.direction,
      sourceKind: source.sourceKind,
      entities: source.entities,
      localFixtureBacking: datastores,
      googleCloudProvisioning: {
        datastores: datastorePlans,
        requiredApis: uniq(datastorePlans.flatMap((plan) => plan.requiredApis)),
      },
      mcpStrategy: {
        preference: simulator
          ? "simulator_backed_mcp_adapter"
          : hasFirstParty ? "first_party_google_cloud_mcp_then_domain_adapter" : "custom_fixture_backed_mcp_adapter",
        firstPartyGoogleMcp: firstPartyUsage,
        simulatorBacked: simulator ? {
          simulatorId: simulator.id,
          displayName: simulator.displayName,
          maturity: simulator.maturity,
          family: simulator.family,
          tools: simulator.tools || [],
          backingStores: simulator.backingStores || [],
          failureModes: simulator.failureModes || [],
          strategy: simulator.sourceIntegration?.strategy || "simulator-backed-mcp",
          runtime: simulator.sourceIntegration?.runtime || "cloud-run-mcp-service",
        } : null,
        customMcpAdapter: customMcpNeeded ? {
          simulatorBacked: Boolean(simulator),
          simulatorId: simulator?.id || null,
          sourceAdapterManifest: apiContract ? "mock_data/apis/source-adapters.json" : null,
          mcpTools: apiContract ? "mock_data/apis/mcp-tools.json" : null,
          localAdapter: apiContract ? "mock_data/apis/mcp-adapter/" : null,
          cloudRunService: adapterServiceName,
          registerCommand: `factory register --dir ${dir} --as mcp --project ${project} --region ${location}`,
          adkUsage: [
            "from google.adk.auth.credential_manager import CredentialManager",
            "from google.adk.integrations.agent_identity import GcpAuthProvider",
            "from google.adk.integrations.agent_registry import AgentRegistry",
            "CredentialManager.register_auth_provider(GcpAuthProvider())  # ADC / agent identity",
            `registry = AgentRegistry(project_id="${project}", location="${location}")`,
            `# Custom domain MCP (per-dept service), resolved by its registered server name.`,
            `tools = registry.get_mcp_toolset(mcp_server_name="mcpServers/${snakeCase(pipeline.name || "mock-agent").replace(/_/g, "-")}")`,
          ].join("\n"),
        } : null,
      },
      registry: {
        agentRegistryRequired: customMcpNeeded,
        toolRegistryRequired: hasFirstParty || customMcpNeeded,
        registrationTargets: [
          ...firstParty.map((service) => ({ type: "first_party_mcp", api: service.api, registry: "ApiRegistry" })),
          ...(customMcpNeeded ? [{
            type: simulator ? "simulator_backed_mcp_server" : "custom_mcp_server",
            registry: "Agent Registry",
            serviceName: adapterServiceName,
            simulatorId: simulator?.id || null,
          }] : []),
        ],
      },
    };
  });

  const requiredApis = uniq([
    ...(cloudPlan?.googleCloud?.requiredApis || []),
    ...sourceIntegrations.flatMap((source) => source.googleCloudProvisioning.requiredApis),
    ...sourceIntegrations.flatMap((source) => source.mcpStrategy.firstPartyGoogleMcp.map((service) => service.api)),
    ...(apiContract ? DATASTORE_PROVISIONING.api.requiredApis : []),
  ]);
  const firstPartyServices = uniq(sourceIntegrations.flatMap((source) => source.mcpStrategy.firstPartyGoogleMcp.map((service) => service.service)));
  const customMcpSources = sourceIntegrations.filter((source) => source.mcpStrategy.customMcpAdapter);
  const plan = {
    id: `${snakeCase(pipeline.name || basename(dir))}_source_integration_plan`,
    generatedAt,
    project,
    location,
    policy: {
      firstPartyGoogleMcpPreferred: true,
      firstPartyRegistration: "Official Google and Google Cloud MCP servers are automatically registered in Agent Registry when the supported API is enabled.",
      manualRegistration: "External/custom MCP servers must be registered with an endpoint, supported protocol binding, and <=10 KB tool specification.",
      customMcpFallback: "Use simulator-backed Cloud Run MCP adapters for registered upstream simulators; otherwise use fixture-backed Cloud Run MCP only when a first-party Google MCP toolset is unavailable or a domain facade is needed.",
      adkCapabilityOrder: ["stateful simulator-backed MCP for registered upstream systems", "first-party MCP via MCPToolset over googleapis.com/mcp", "registered per-department MCP via MCPToolset", "local ADK Python function tools for deterministic development"],
      authBoundary: "Auth policy is intentionally recorded as integration metadata only; detailed auth design remains a dedicated follow-up.",
      registryLocationConstraint: "Manual MCP registration is not supported in us/eu multi-region locations; use a supported region or global.",
      simulatorRegistry: simulatorRegistry.path,
    },
    sources: sourceIntegrations,
    googleCloud: {
      requiredApis,
      provisionCommands: requiredApis.map((api) => `gcloud services enable ${api} --project ${project}`),
      managedMcpEnableCommands: firstPartyServices
        .map((service) => MANAGED_MCP_BY_ID.get(service))
        .filter(Boolean)
        .map((service) => `gcloud services enable ${service.api} --project ${project}`),
      customAdapterDeployCommand: apiContract ? `bash mock_data/apis/deploy-adapter.sh && factory register --dir ${dir} --as mcp --project ${project} --region ${location}` : null,
    },
    registries: {
      toolRegistry: {
        firstPartyMcpServices: firstPartyServices.map((id) => MANAGED_MCP_BY_ID.get(id)).filter(Boolean),
        customMcpServers: customMcpSources.map((source) => ({
          source: source.id,
          serviceName: adapterServiceName,
          simulatorBacked: Boolean(source.mcpStrategy.simulatorBacked),
          simulatorId: source.mcpStrategy.simulatorBacked?.simulatorId || null,
          manifest: "mock_data/apis/mcp-tools.json",
          registerCommand: `factory register --dir ${dir} --as mcp --project ${project} --region ${location}`,
        })),
      },
      agentRegistry: {
        adkRuntime: `factory register --dir ${dir} --as adk --project ${project} --region ${location}`,
        mcpServers: customMcpSources.length ? `factory register --dir ${dir} --as mcp --project ${project} --region ${location}` : null,
      },
    },
    artifacts: {
      plan: "mock_data/plan/source-integration-plan.json",
      toolRegistryPlan: "artifacts/tool-registry-plan.json",
      sourceAdapters: apiContract ? "mock_data/apis/source-adapters.json" : null,
      mcpTools: apiContract ? "mock_data/apis/mcp-tools.json" : null,
      cloudData: cloudPlan ? "mock_data/cloud/cloud-data-manifest.json" : null,
    },
    validation: {
      hasSources: sources.length > 0,
      hasAnyToolExposure: sourceIntegrations.some((source) => source.registry.toolRegistryRequired),
      customMcpHasAdapterArtifacts: !customMcpSources.length || Boolean(apiContract),
    },
  };
  await writeJson(join(outDir, "source-integration-plan.json"), plan);
  await writeJson(join(dir, "artifacts", "tool-registry-plan.json"), {
    generatedAt,
    firstPartyGoogleMcp: plan.registries.toolRegistry.firstPartyMcpServices,
    customMcpServers: plan.registries.toolRegistry.customMcpServers,
    agentRegistry: plan.registries.agentRegistry,
  });
  markStep(pipeline, "sourceIntegration", "done", {
    output: plan.artifacts.plan,
    sources: sourceIntegrations.length,
    firstPartyMcpServices: firstPartyServices,
    customMcpServers: customMcpSources.length,
  });
  await savePipeline(dir, pipeline);
  return plan;
}
