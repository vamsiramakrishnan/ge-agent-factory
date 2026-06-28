import { test, expect } from "bun:test";
import { buildSemanticModel } from "../scripts/factory/data/semantic-model.mjs";

const MANIFEST = {
  id: "account-reconciliation-agent",
  generatedAt: "1970-01-01T00:00:00.000Z",
  systems: [{ id: "sap_s_4hana_fi", name: "SAP S/4HANA FI", responsibility: "General ledger of record." }],
  tables: [
    { name: "gl_entries", sourceSystem: "SAP S/4HANA FI", primaryKey: "id",
      columns: [{ name: "id", type: "string" }, { name: "account", type: "string" }, { name: "amount", type: "number" }, { name: "posting_date", type: "string" }], rowCount: 48 },
    { name: "reconciliations", sourceSystem: "BlackLine", primaryKey: "id",
      columns: [{ name: "id", type: "string" }, { name: "account", type: "string" }, { name: "status", type: "string" }] },
  ],
  useCaseSpec: { behaviorContract: {
    primaryObjective: "Certify 85% of accounts without manual review.",
    toolIntents: [{ name: "compute_certification_rate", kind: "calculation", description: "Certified / total.", produces: ["rate"] }],
  } },
};

test("builds tables with described, typed columns + grain", () => {
  const m = buildSemanticModel(MANIFEST, { agentId: "account-reconciliation-agent" });
  const gl = m.tables.find((t) => t.name === "gl_entries");
  expect(gl.sourceSystem).toBe("SAP S/4HANA FI");
  const amount = gl.columns.find((c) => c.name === "amount");
  expect(amount.description.toLowerCase()).toContain("monetary");
  const idCol = gl.columns.find((c) => c.name === "id");
  expect(idCol.isKey).toBe(true);
});

test("detects cross-table joins on shared key columns (account)", () => {
  const m = buildSemanticModel(MANIFEST);
  const acc = m.joins.find((j) => j.on === "account");
  expect(acc).toBeTruthy();
  expect(acc.left).toContain("gl_entries.account");
});

test("derives measures from calculation tool-intents and a BQ description payload", () => {
  const m = buildSemanticModel(MANIFEST);
  expect(m.measures.map((x) => x.name)).toContain("compute_certification_rate");
  expect(m.bigquery.tables[0].columns.length).toBeGreaterThan(0);
  expect(m.dataset).toBe("agent_account_reconciliation_agent");
});
