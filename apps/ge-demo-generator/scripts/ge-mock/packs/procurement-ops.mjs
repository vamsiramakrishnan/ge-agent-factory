import { appendPackEvalHint, findTableDef, hasAny, setIfColumn, tableRows, textOf } from "./pack-utils.mjs";

const VENDORS = ["Apex Facilities", "Northstar Logistics", "Summit Software", "Vertex Components"];
const AMOUNTS = [18500.25, 74200.9, 126000.0, 9800.5];

function seedSpendTable(schema, generatedTables, tableName) {
  const tableDef = findTableDef(schema, tableName);
  const rows = tableRows(generatedTables, tableName);
  if (!tableDef || !rows.length) return;
  rows.slice(0, 4).forEach((row, index) => {
    setIfColumn(row, tableDef.columns, "vendor", VENDORS[index]);
    setIfColumn(row, tableDef.columns, "supplier", VENDORS[index]);
    setIfColumn(row, tableDef.columns, "amount", AMOUNTS[index]);
    setIfColumn(row, tableDef.columns, "currency", "USD");
    setIfColumn(row, tableDef.columns, "status", ["pending", "approved", "approved", "rejected"][index]);
    setIfColumn(row, tableDef.columns, "created_at", `2026-05-${String(6 + index).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "due_date", `2026-06-${String(6 + index * 4).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "notes", `${VENDORS[index]} seeded for spend, approval, renewal, and supplier-risk workflows.`);
  });
}

function seedContracts(schema, generatedTables) {
  const tableDef = findTableDef(schema, "contracts");
  const rows = tableRows(generatedTables, "contracts");
  if (!tableDef || !rows.length) return;
  rows.slice(0, 4).forEach((row, index) => {
    setIfColumn(row, tableDef.columns, "vendor", VENDORS[index]);
    setIfColumn(row, tableDef.columns, "supplier", VENDORS[index]);
    setIfColumn(row, tableDef.columns, "amount", AMOUNTS[index] * 3);
    setIfColumn(row, tableDef.columns, "currency", "USD");
    setIfColumn(row, tableDef.columns, "status", ["pending", "approved", "approved", "draft"][index]);
    setIfColumn(row, tableDef.columns, "created_at", `2026-04-${String(10 + index).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "due_date", `2026-07-${String(12 + index * 2).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "notes", `${VENDORS[index]} contract includes renewal date, approval status, and risk-review context.`);
  });
}

export const procurementOpsPack = {
  id: "system_procurement_ops",
  layer: "system",
  description: "Common procurement and supplier operations recipe for Coupa, Ariba, SAP procurement, suppliers, POs, contracts, risk, and spend.",
  departments: ["procurement"],
  systems: ["coupa", "sap_ariba", "sap_s_4hana"],
  capabilities: ["supplier", "sourcing", "contracts", "purchase_orders", "spend", "fixture_recipe"],
  simulatorInterop: {
    archetypes: ["procurement", "supply_chain", "clm"],
    collections: ["suppliers", "purchase_orders", "requisitions", "contracts", "approvals", "materials", "shipments", "risk_events", "agreements"],
    materializes: "supplier, spend, requisition, purchase order, contract, and supplier-risk rows into procurement simulator seeds",
  },
  match(context) {
    return hasAny(textOf(context), [/coupa/, /ariba/, /supplier/, /sourcing/, /contract/, /purchase_order/, /requisition/, /\bspend\b/]);
  },
  apply({ schema, generatedTables }) {
    seedSpendTable(schema, generatedTables, "requisitions");
    seedSpendTable(schema, generatedTables, "purchase_orders");
    seedSpendTable(schema, generatedTables, "invoices");
    seedContracts(schema, generatedTables);
  },
  enrichContract({ contract }) {
    appendPackEvalHint(contract, {
      packId: "system_procurement_ops",
      expectedToolKinds: ["query", "evidence_lookup", "action"],
      mustReferenceEntities: ["suppliers", "contracts", "requisitions", "purchase_orders", "invoices"],
      successCriteria: ["Cite vendor, amount, status, and due-date evidence for approval or sourcing recommendations.", "Differentiate pending, approved, paid, and rejected spend records.", "Escalate high-value or missing-contract cases before action."],
      refusalRules: ["Do not approve, renew, or recommend supplier action without supplier/spend evidence."],
    });
  },
};
