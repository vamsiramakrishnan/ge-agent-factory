export const MOCK_SYSTEMS = [
  {
    id: "bigquery",
    name: "BigQuery MCP",
    status: "mocked",
    description: "Dataset discovery, schema inspection, and SELECT-only SQL execution.",
    tools: ["list_dataset_ids", "list_table_ids", "get_table_info", "execute_sql"],
    fixtures: {
      datasets: ["demo_retail_ops", "demo_hr_skills"],
      tables: ["orders", "locations", "incidents", "employees", "skills"],
    },
  },
  {
    id: "maps",
    name: "Google Maps MCP",
    status: "mocked",
    description: "Place search, geocoding, reverse geocoding, and route estimates.",
    tools: ["search_places", "get_place", "geocode", "reverse_geocode", "compute_routes"],
    fixtures: {
      routeLatency: "deterministic",
      geographies: ["New York, NY", "Chicago, IL", "San Francisco, CA", "Tokyo, Japan"],
    },
  },
  {
    id: "vertex-adk",
    name: "Vertex AI ADK",
    status: "scaffold",
    description: "Generated ADK agent code and deployment package target.",
    tools: ["agent.py", "tools.py", "pyproject.toml", "adk web"],
  },
  {
    id: "external-evidence",
    name: "External Evidence Files",
    status: "mocked",
    description: "PDF and spreadsheet artifacts used as cross-system evidence.",
    tools: ["read_document", "read_sheet", "compare_records"],
  },
];

export function renderSystemPrompt() {
  return [
    "You are running inside the GE Demo Generator coding harness.",
    "Use the mirrored capability skills in the handoff packet as the source of truth before acting.",
    "GE skills own the enterprise use-case flow: interview and source selection, system/data modeling, deterministic data generation, API/MCP adapter packaging, evidence, factory orchestration, and iterative refinement.",
    "Official installed Agents CLI skills own the Google ADK lifecycle mechanics: scaffold, ADK code, evals, deployment, Gemini Enterprise publishing, and observability. Use them in tandem with the GE skills instead of recreating their guidance.",
    "For ADK coding-agent guidance, treat https://adk.dev/tutorials/coding-with-ai/#agents-cli as the canonical public reference: Agents CLI skills are the official ADK coding skills for supported coding harnesses.",
    "For end-to-end ADK agent creation from fuzzy requirements, start with interviewing-specs, then compose running-factory, building-simulators, checking-workspaces, and recording-evidence as needed.",
    "For ADK implementation details, follow google-agents-cli-workflow plus the phase-specific google-agents-cli-scaffold, google-agents-cli-adk-code, google-agents-cli-eval, google-agents-cli-deploy, google-agents-cli-publish, and google-agents-cli-observability skills.",
    "When using Antigravity for ADK work, prefer an ADK Docs MCP server configured from AgentDevelopmentKit:https://adk.dev/llms.txt for current API and deployment documentation; do not rely on stale remembered ADK details when the docs MCP is available.",
    "For the full agent pipeline, use running-factory, building-simulators, and the factory CLI. Source adapters may be local fixture-backed services during development and deployable API/MCP services when live cloud deployment is explicitly requested.",
    "For fuzzy requirements or department/use-case selection, use interviewing-specs and the slide-derived src/use-cases.generated.js catalog.",
    "After generating a workspace, use checking-workspaces to audit, validate, repair, and gate the agent iteratively.",
    "Use the installed Gemini ADK docs extension/MCP or equivalent ADK Docs MCP when current ADK API or deployment documentation is needed.",
    "Before implementing ADK tool, registry, or Gemini Enterprise publishing work, read docs/adk-registration-model.md and preserve its distinction between local ADK tools, Cloud API/Agent Registry resources, deployment, and Gemini Enterprise publishing.",
    "Treat these external systems as mocked unless the user explicitly asks to wire the live service:",
    ...MOCK_SYSTEMS.map((system) => `- ${system.name} (${system.id}): ${system.description}`),
    "",
    "For mock-only projects, do not require Google auth, do not call google.auth.default(), do not set GOOGLE_GENAI_USE_VERTEXAI, and do not add Cloud deployment steps as the default local path.",
    "Generated ADK projects should run locally with uv first: prefer pyproject.toml, app/agent.py, app/tools.py, deterministic fixtures, README run commands, and optional eval files before deployment or publishing.",
    "If agents-cli scaffold creates Cloud-oriented boilerplate, adapt it back to local mock mode unless the user explicitly asks for deployment or Gemini Enterprise registration.",
    "",
    "When editing code, keep changes scoped to the repository and preserve the unified workspace pipeline contract.",
  ].join("\n");
}
