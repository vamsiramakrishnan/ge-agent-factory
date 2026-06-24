import { appendPackEvalHint, findTableDef, hasAny, setIfColumn, tableRows, textOf } from "./pack-utils.mjs";

function seedRiskTable(schema, generatedTables, tableName) {
  const tableDef = findTableDef(schema, tableName);
  const rows = tableRows(generatedTables, tableName);
  if (!tableDef || !rows.length) return;
  rows.slice(0, 4).forEach((row, index) => {
    setIfColumn(row, tableDef.columns, "status", ["active", "pending", "closed", "active"][index]);
    setIfColumn(row, tableDef.columns, "owner", ["Risk Ops", "Compliance Lead", "Supplier Manager", "Legal Review"][index]);
    setIfColumn(row, tableDef.columns, "created_at", `2026-05-${String(16 + index).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "notes", `${tableName} seeded with sanctions, watchlist, and third-party risk review evidence.`);
  });
}

export const thirdPartyRiskPack = {
  id: "system_third_party_risk",
  layer: "system",
  description: "Common sanctions, watchlist, and third-party risk screening recipe for OFAC, World-Check, LexisNexis, and risk-compliance feeds.",
  departments: ["procurement"],
  systems: ["ofac_sdn", "world_check", "lexisnexis", "dow_jones_risk_compliance"],
  capabilities: ["sanctions_screening", "watchlist", "third_party_risk", "compliance", "fixture_recipe"],
  simulatorInterop: {
    archetypes: ["external_intelligence", "risk_grc", "procurement"],
    collections: ["companies", "signals", "watchlists", "risk_scores", "source_feeds", "risks", "controls", "suppliers"],
    materializes: "watchlist, sanctions, supplier risk, and external intelligence rows into risk/procurement simulator seeds",
  },
  match(context) {
    return hasAny(textOf(context), [/ofac/, /world_check/, /lexisnexis/, /dow_jones_risk/, /sanctions/, /watchlist/, /screening/, /third.party risk/]);
  },
  apply({ schema, generatedTables }) {
    seedRiskTable(schema, generatedTables, "ofac_sdn_records");
    seedRiskTable(schema, generatedTables, "world_check_records");
    seedRiskTable(schema, generatedTables, "lexisnexis_records");
    seedRiskTable(schema, generatedTables, "dow_jones_risk_compliance_records");
  },
  enrichContract({ contract }) {
    appendPackEvalHint(contract, {
      packId: "system_third_party_risk",
      expectedToolKinds: ["query", "evidence_lookup", "action"],
      mustReferenceEntities: ["ofac_sdn_records", "world_check_records", "lexisnexis_records"],
      successCriteria: ["Cite screening source, match status, and review notes for risk decisions.", "Escalate active or pending watchlist evidence.", "Avoid clearing suppliers with unresolved screening records."],
      refusalRules: ["Do not clear, approve, or dismiss third-party risk without sanctions or watchlist evidence."],
    });
  },
};
