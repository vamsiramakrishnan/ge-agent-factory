import { analyticsPack } from "./analytics.mjs";
import { contentCollaborationPack } from "./content-collaboration.mjs";
import { crmMarketingOpsPack } from "./crm-marketing-ops.mjs";
import { digitalAssetPack } from "./digital-assets.mjs";
import { financeErpPack } from "./finance-erp.mjs";
import { hrEmployeeRecordsPack } from "./hr-employee-records.mjs";
import { hrBenefitsPack } from "./hr-benefits.mjs";
import { identitySecurityPack } from "./identity-security.mjs";
import { itsmPack } from "./itsm.mjs";
import { learningTalentPack } from "./learning-talent.mjs";
import { procurementOpsPack } from "./procurement-ops.mjs";
import { seoMonitoringPack } from "./seo-monitoring.mjs";
import { thirdPartyRiskPack } from "./third-party-risk.mjs";
import { appendSimulatorBridgeHint } from "./pack-utils.mjs";

const SCENARIO_PACKS = [
  analyticsPack,
  contentCollaborationPack,
  hrEmployeeRecordsPack,
  learningTalentPack,
  itsmPack,
  identitySecurityPack,
  crmMarketingOpsPack,
  digitalAssetPack,
  seoMonitoringPack,
  procurementOpsPack,
  thirdPartyRiskPack,
  financeErpPack,
  hrBenefitsPack,
];

export function listScenarioPacks() {
  return SCENARIO_PACKS.map((pack) => ({
    id: pack.id,
    description: pack.description || "",
    layer: pack.layer || "domain",
    systems: pack.systems || [],
    departments: pack.departments || [],
    capabilities: pack.capabilities || [],
    simulatorInterop: pack.simulatorInterop || null,
    depth: {
      classification: true,
      fixtureRecipe: (pack.capabilities || []).includes("fixture_recipe"),
      evalEnrichment: typeof pack.enrichContract === "function",
      instructionEnrichment: typeof pack.enrichContract === "function",
      simulatorBridge: Boolean(pack.simulatorInterop),
    },
  }));
}

export function matchScenarioPacks(context) {
  return SCENARIO_PACKS.filter((pack) => pack.match(context));
}

export function enrichScenarioSpec(schema) {
  const contract = schema?.useCaseSpec?.behaviorContract || null;
  if (!contract) return schema;
  const context = {
    schema,
    contract,
    generatedTables: null,
    employeeIds: extractEmployeeIdsFromContract(contract),
  };
  for (const pack of matchScenarioPacks(context)) {
    appendSimulatorBridgeHint(contract, pack);
    if (typeof pack.enrichContract === "function") pack.enrichContract(context);
  }
  return schema;
}

function extractEmployeeIdsFromContract(contract) {
  const ids = new Set();
  for (const ev of contract?.goldenEvals || []) {
    for (const match of String(ev.prompt || "").matchAll(/\bEMP[-_]\d{3,}\b/gi)) {
      ids.add(match[0].replace("_", "-").toUpperCase());
    }
  }
  return [...ids];
}

function ensureRow(rows, index) {
  while (rows.length <= index) rows.push({ ...(rows[rows.length - 1] || {}) });
  return rows[index];
}

function setIfColumn(row, columns, name, value) {
  if ((columns || []).some((column) => column.name === name)) row[name] = value;
}

function repairGeneratedReferences(schema, generatedTables) {
  for (const tableDef of schema.tables || []) {
    const rows = generatedTables[tableDef.name] || [];
    for (const col of tableDef.columns || []) {
      if (col.type !== "ref" || !col.ref) continue;
      const [refTable, refField = "id"] = col.ref.split(".");
      const refRows = generatedTables[refTable] || [];
      const refValues = refRows.map((row) => row?.[refField]).filter((value) => value !== undefined && value !== null && value !== "");
      if (!refValues.length) continue;
      rows.forEach((row, index) => {
        if (!refValues.includes(row[col.name])) row[col.name] = refValues[index % refValues.length];
      });
    }
  }
}

export function applyScenarioBindings(schema, generatedTables) {
  const contract = schema?.useCaseSpec?.behaviorContract || null;
  if (!contract) return;
  const employeeIds = extractEmployeeIdsFromContract(contract);
  const context = { schema, generatedTables, contract, employeeIds };
  const employeesDef = (schema.tables || []).find((table) => table.name === "employees");
  const employees = generatedTables.employees || [];
  employeeIds.forEach((employeeId, index) => {
    const row = ensureRow(employees, index);
    setIfColumn(row, employeesDef?.columns, "id", employeeId);
    setIfColumn(row, employeesDef?.columns, "source_record_id", employeeId);
    setIfColumn(row, employeesDef?.columns, "employment_status", index === 0 ? "active" : (row.employment_status || "active"));
    setIfColumn(row, employeesDef?.columns, "life_event", index === 0 ? "birth_of_child" : (row.life_event || "none"));
    setIfColumn(row, employeesDef?.columns, "dependents", index === 0 ? Math.max(1, Number(row.dependents || 1)) : Number(row.dependents || 0));
    setIfColumn(row, employeesDef?.columns, "region", row.region || "US");
  });
  for (const pack of matchScenarioPacks(context)) {
    appendSimulatorBridgeHint(contract, pack);
    pack.apply(context);
  }
  repairGeneratedReferences(schema, generatedTables);
}
