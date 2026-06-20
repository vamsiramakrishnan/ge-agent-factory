import { appendPackEvalHint, findTableDef, hasAny, setIfColumn, tableRows, textOf } from "./pack-utils.mjs";

function seedAssetTable(schema, generatedTables, tableName) {
  const tableDef = findTableDef(schema, tableName);
  const rows = tableRows(generatedTables, tableName);
  if (!tableDef || !rows.length) return;
  rows.slice(0, 4).forEach((row, index) => {
    setIfColumn(row, tableDef.columns, "status", ["draft", "review", "approved", "archived"][index]);
    setIfColumn(row, tableDef.columns, "owner", ["Brand Ops", "Creative Lead", "Legal Review", "Channel Manager"][index]);
    setIfColumn(row, tableDef.columns, "created_at", `2026-05-${String(7 + index).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "notes", `${tableName} seeded with brand compliance, approval queue, and asset lifecycle evidence.`);
  });
}

export const digitalAssetPack = {
  id: "system_digital_assets",
  layer: "system",
  description: "Common brand, creative, DAM, and asset lifecycle recipe for Bynder, Brandfolder, Figma, Canva, and approval queues.",
  departments: ["marketing"],
  systems: ["bynder", "brandfolder", "figma", "canva"],
  capabilities: ["brand_governance", "asset_lifecycle", "creative_review", "fixture_recipe"],
  simulatorInterop: {
    archetypes: ["content_cms", "collaboration_docs"],
    collections: ["assets", "content_items", "workflow_tasks", "campaigns", "approvals", "documents", "comments"],
    materializes: "brand assets, creative review tasks, usage rights, and approval rows into content/DAM simulator seeds",
  },
  match(context) {
    return hasAny(textOf(context), [/bynder/, /brandfolder/, /figma/, /canva/, /brand_guideline/, /assets/, /asset_versions/, /approval_queues/]);
  },
  apply({ schema, generatedTables }) {
    seedAssetTable(schema, generatedTables, "assets");
    seedAssetTable(schema, generatedTables, "asset_versions");
    seedAssetTable(schema, generatedTables, "approval_queues");
    seedAssetTable(schema, generatedTables, "brandfolder_records");
  },
  enrichContract({ contract }) {
    appendPackEvalHint(contract, {
      packId: "system_digital_assets",
      expectedToolKinds: ["query", "evidence_lookup", "action"],
      mustReferenceEntities: ["assets", "asset_versions", "approval_queues"],
      successCriteria: ["Use asset status, version, and approval evidence before enforcing brand rules.", "Distinguish draft/review assets from approved assets.", "Escalate missing approval evidence before publishing."],
      refusalRules: ["Do not claim brand approval or publish readiness without DAM approval evidence."],
    });
  },
};
