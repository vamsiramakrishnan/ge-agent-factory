import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { snakeCase } from "../core/naming.mjs";

const SCRIPT_DIR = fileURLToPath(new URL(".", import.meta.url));
const REGISTRY_PATH = resolve(SCRIPT_DIR, "../../../simulator-systems/registry.json");
const REPO_ROOT = resolve(SCRIPT_DIR, "../../../../..");

export function normalizeSimulatorKey(value) {
  return String(value || "")
    .replace(/&/g, "and")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .toLowerCase()
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

export function loadSimulatorRegistry() {
  const registry = JSON.parse(readFileSync(REGISTRY_PATH, "utf8"));
  const simulators = (Array.isArray(registry.simulators) ? registry.simulators : []).map((simulator) => {
    const schema = simulator.schemaPath ? JSON.parse(readFileSync(resolve(REPO_ROOT, simulator.schemaPath), "utf8")) : null;
    const toolCatalog = simulator.toolsPath ? JSON.parse(readFileSync(resolve(REPO_ROOT, simulator.toolsPath), "utf8")) : null;
    const projection = simulator.projectionPath ? JSON.parse(readFileSync(resolve(REPO_ROOT, simulator.projectionPath), "utf8")) : null;
    const materialization = simulator.materializationPath ? JSON.parse(readFileSync(resolve(REPO_ROOT, simulator.materializationPath), "utf8")) : null;
    const workflowCatalog = simulator.workflowsPath ? JSON.parse(readFileSync(resolve(REPO_ROOT, simulator.workflowsPath), "utf8")) : null;
    return {
      ...simulator,
      schema,
      toolCatalog,
      projection,
      materialization,
      workflowCatalog,
      tools: toolCatalog?.tools?.length ? toolCatalog.tools.map((tool) => tool.name) : simulator.tools || [],
    };
  });
  return {
    ...registry,
    path: REGISTRY_PATH,
    simulators,
  };
}

export function simulatorIndex(registry = loadSimulatorRegistry()) {
  const byKey = new Map();
  for (const simulator of registry.simulators || []) {
    const keys = [simulator.id, simulator.displayName, ...(simulator.aliases || [])]
      .map(normalizeSimulatorKey)
      .filter(Boolean);
    for (const key of keys) byKey.set(key, simulator);
  }
  return byKey;
}

const VARIANT_MATCHERS = [
  { pattern: /^sap_s_4hana.*(fi|co|miro|vendor_master|xk01|f110)/, simulatorId: "sap_s4hana_fi" },
  { pattern: /^sap_s_4hana.*(mm|sd|purchas|material)/, simulatorId: "sap_s4hana_mm" },
  { pattern: /^sap_grc$/, simulatorId: "auditboard" },
  { pattern: /^ariba_slp$/, simulatorId: "sap_ariba" },
  { pattern: /^linkedin_ads$/, simulatorId: "salesforce_marketing_cloud" },
  { pattern: /^(active_directory|ad|microsoft_entra|entra_id)$/, simulatorId: "okta" },
  { pattern: /^sap_successfactors$/, simulatorId: "workday" },
];

function variantSimulatorForKey(key, registry) {
  for (const matcher of VARIANT_MATCHERS) {
    if (!matcher.pattern.test(key)) continue;
    const simulator = (registry.simulators || []).find((item) => item.id === matcher.simulatorId);
    if (simulator) return simulator;
  }
  return null;
}

export function findSimulatorForSystem(system, registry = loadSimulatorRegistry()) {
  const key = normalizeSimulatorKey(system);
  if (!key) return null;
  const byKey = simulatorIndex(registry);
  if (byKey.has(key)) return byKey.get(key);
  for (const [candidateKey, simulator] of byKey.entries()) {
    if (key.startsWith(candidateKey) || candidateKey.startsWith(key)) return simulator;
  }
  const variant = variantSimulatorForKey(key, registry);
  if (variant) return variant;
  return null;
}

export function simulatorBindingForTool({ sourceSystemId, sourceSystem, toolName }, registry = loadSimulatorRegistry()) {
  const simulator = findSimulatorForSystem(sourceSystemId || sourceSystem, registry);
  if (!simulator) return null;
  const safeToolName = snakeCase(toolName);
  if (!(simulator.tools || []).includes(safeToolName)) return null;
  return {
    system_id: simulator.id,
    tool: safeToolName,
  };
}

export function implementedSimulators(registry = loadSimulatorRegistry()) {
  return new Map((registry.simulators || []).map((simulator) => [simulator.id, simulator]));
}
