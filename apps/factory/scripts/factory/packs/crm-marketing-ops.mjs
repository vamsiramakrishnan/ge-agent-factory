import { appendPackEvalHint, ensureRow, findTableDef, hasAny, setIfColumn, tableRows, textOf } from "./pack-utils.mjs";

const STAGES = ["prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"];
const OWNERS = ["Nina Patel", "Chris Romero", "Avery Brooks", "Sam Okafor"];

function seedPipelineTable(schema, generatedTables, tableName) {
  const tableDef = findTableDef(schema, tableName);
  const rows = tableRows(generatedTables, tableName);
  if (!tableDef || !rows.length) return;
  rows.slice(0, 4).forEach((row, index) => {
    const accountName = ["Apex Industrial", "Northstar Health", "Summit Retail", "Vertex Energy"][index];
    setIfColumn(row, tableDef.columns, "account_name", accountName);
    setIfColumn(row, tableDef.columns, "company", accountName);
    setIfColumn(row, tableDef.columns, "amount", [125000, 285000, 64000, 910000][index]);
    setIfColumn(row, tableDef.columns, "stage", STAGES[index + 1]);
    setIfColumn(row, tableDef.columns, "status", index === 3 ? "closed" : "active");
    setIfColumn(row, tableDef.columns, "owner", OWNERS[index]);
    setIfColumn(row, tableDef.columns, "close_date", `2026-06-${String(10 + index * 3).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "created_at", `2026-05-${String(5 + index).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "notes", `${accountName} is in ${STAGES[index + 1]} with campaign-attributed follow-up required.`);
  });
}

function seedCampaigns(schema, generatedTables) {
  const tableDef = findTableDef(schema, "campaigns");
  const rows = tableRows(generatedTables, "campaigns");
  if (!tableDef || !rows.length) return;
  rows.slice(0, 4).forEach((row, index) => {
    const name = ["Q3 Pipeline Acceleration", "Healthcare ABM Nurture", "Partner Webinar Series", "Renewal Expansion Motion"][index];
    setIfColumn(row, tableDef.columns, "name", name);
    setIfColumn(row, tableDef.columns, "campaign_name", name);
    setIfColumn(row, tableDef.columns, "status", ["active", "active", "pending", "closed"][index]);
    setIfColumn(row, tableDef.columns, "owner", OWNERS[index]);
    setIfColumn(row, tableDef.columns, "created_at", `2026-05-${String(8 + index).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "notes", `${name} is seeded with measurable audience, lead, and funnel movement.`);
  });
}

function seedLeadsAndContacts(schema, generatedTables, tableName) {
  const tableDef = findTableDef(schema, tableName);
  const rows = tableRows(generatedTables, tableName);
  if (!tableDef || !rows.length) return;
  rows.slice(0, 4).forEach((row, index) => {
    setIfColumn(row, tableDef.columns, "status", ["active", "pending", "active", "closed"][index]);
    setIfColumn(row, tableDef.columns, "owner", OWNERS[index]);
    setIfColumn(row, tableDef.columns, "created_at", `2026-05-${String(12 + index).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "notes", `Lead shows ${["high", "medium", "high", "low"][index]} fit and requires stage-specific follow-up.`);
  });
}

export const crmMarketingOpsPack = {
  id: "system_crm_marketing_ops",
  layer: "system",
  description: "Common CRM and marketing-operations recipe for Salesforce, HubSpot, campaigns, leads, audiences, and funnel analytics.",
  departments: ["marketing"],
  systems: ["salesforce_crm", "hubspot", "marketo"],
  capabilities: ["campaigns", "leads", "audiences", "funnel", "fixture_recipe"],
  simulatorInterop: {
    archetypes: ["crm", "marketing_automation", "digital_analytics"],
    collections: ["accounts", "contacts", "opportunities", "activities", "campaigns", "leads", "journeys", "segments", "audiences"],
    materializes: "pipeline, campaign, lead, contact, audience, and conversion rows into CRM and marketing simulator seeds",
  },
  match(context) {
    return hasAny(textOf(context), [/salesforce/, /hubspot/, /marketo/, /campaign/, /lead/, /audience/, /funnel/, /utm/]);
  },
  apply({ schema, generatedTables }) {
    seedPipelineTable(schema, generatedTables, "accounts");
    seedPipelineTable(schema, generatedTables, "opportunities");
    seedCampaigns(schema, generatedTables);
    seedLeadsAndContacts(schema, generatedTables, "leads");
    seedLeadsAndContacts(schema, generatedTables, "contacts");
  },
  enrichContract({ contract }) {
    appendPackEvalHint(contract, {
      packId: "system_crm_marketing_ops",
      expectedToolKinds: ["query", "calculation", "action"],
      mustReferenceEntities: ["accounts", "opportunities", "campaigns", "leads", "contacts"],
      successCriteria: ["Tie recommendations to funnel stage, owner, campaign, and amount fields.", "Use CRM rows before suggesting campaign or sales actions.", "Separate active pipeline from closed or lost records."],
      refusalRules: ["Do not fabricate pipeline value, conversion movement, or audience fit without CRM evidence."],
    });
  },
};
