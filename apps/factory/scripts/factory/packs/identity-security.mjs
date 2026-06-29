import { appendPackEvalHint, findTableDef, hasAny, setIfColumn, tableRows, textOf } from "./pack-utils.mjs";

function seedSecurityTable(schema, generatedTables, tableName) {
  const tableDef = findTableDef(schema, tableName);
  const rows = tableRows(generatedTables, tableName);
  if (!tableDef || !rows.length) return;
  rows.slice(0, 4).forEach((row, index) => {
    setIfColumn(row, tableDef.columns, "status", ["active", "pending", "closed", "active"][index]);
    setIfColumn(row, tableDef.columns, "owner", ["IAM Admin", "Security Ops", "Zero Trust Lead", "Risk Analyst"][index]);
    setIfColumn(row, tableDef.columns, "created_at", `2026-05-${String(13 + index).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "notes", `${tableName} seeded with access policy, identity, and control evidence for zero-trust evaluation.`);
  });
}

export const identitySecurityPack = {
  id: "system_identity_security",
  layer: "system",
  description: "Common identity and security-control recipe for Okta, BeyondCorp, network controls, access grants, zero trust, and policy evaluation.",
  departments: ["it"],
  systems: ["okta", "google_beyondcorp", "palo_alto_prisma"],
  capabilities: ["identity", "access_policy", "security_controls", "zero_trust", "fixture_recipe"],
  simulatorInterop: {
    archetypes: ["identity", "security", "risk_grc"],
    collections: ["users", "groups", "applications", "entitlements", "access_requests", "assets", "findings", "controls", "approvals"],
    materializes: "identity, access grant, security control, and exception rows into identity/security simulator seeds",
  },
  match(context) {
    return hasAny(textOf(context), [/okta/, /beyondcorp/, /palo_alto/, /zero trust/, /access_grants/, /identity access/, /security_controls/]);
  },
  apply({ schema, generatedTables }) {
    seedSecurityTable(schema, generatedTables, "users");
    seedSecurityTable(schema, generatedTables, "groups");
    seedSecurityTable(schema, generatedTables, "access_grants");
    seedSecurityTable(schema, generatedTables, "palo_alto_prisma_records");
    seedSecurityTable(schema, generatedTables, "google_beyondcorp_records");
  },
  enrichContract({ contract }) {
    appendPackEvalHint(contract, {
      packId: "system_identity_security",
      expectedToolKinds: ["query", "evidence_lookup", "action"],
      mustReferenceEntities: ["users", "groups", "access_grants"],
      successCriteria: ["Tie access decisions to user, group, and grant evidence.", "Treat pending or active risky grants as remediation candidates.", "Escalate missing identity evidence before policy decisions."],
      refusalRules: ["Do not approve, revoke, or attest access without identity and access-grant evidence."],
    });
  },
};
