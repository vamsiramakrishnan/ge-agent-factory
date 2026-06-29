import { appendPackEvalHint, findTableDef, hasAny, setIfColumn, tableRows, textOf } from "./pack-utils.mjs";

const OWNERS = ["Avery Brooks", "Sam Okafor", "Riley Stone", "Mina Rao"];

function seedTicketLike(schema, generatedTables, tableName) {
  const tableDef = findTableDef(schema, tableName);
  const rows = tableRows(generatedTables, tableName);
  if (!tableDef || !rows.length) return;
  rows.slice(0, 4).forEach((row, index) => {
    setIfColumn(row, tableDef.columns, "status", ["active", "pending", "closed", "active"][index]);
    setIfColumn(row, tableDef.columns, "owner", OWNERS[index]);
    setIfColumn(row, tableDef.columns, "created_at", `2026-05-${String(10 + index).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "notes", `${tableName} seeded with SLA, owner, and remediation context for service workflow evaluation.`);
  });
}

export const itsmPack = {
  id: "system_itsm",
  layer: "system",
  description: "Common ITSM recipe for ServiceNow, Jira, incidents, tickets, change requests, SLAs, and remediation workflows.",
  departments: ["it"],
  systems: ["servicenow", "jira"],
  capabilities: ["tickets", "incidents", "change_management", "sla", "fixture_recipe"],
  simulatorInterop: {
    archetypes: ["itsm", "project_work", "observability"],
    collections: ["tickets", "cmdb_items", "changes", "slas", "approvals", "issues", "alerts", "incidents"],
    materializes: "ticket, incident, change, SLA, Jira issue, and remediation rows into ITSM simulator seeds",
  },
  match(context) {
    return hasAny(textOf(context), [/servicenow/, /\bjira\b/, /incident/, /ticket/, /change_request/, /\bsla\b/, /remediat/]);
  },
  apply({ schema, generatedTables }) {
    seedTicketLike(schema, generatedTables, "tickets");
    seedTicketLike(schema, generatedTables, "incidents");
    seedTicketLike(schema, generatedTables, "change_requests");
  },
  enrichContract({ contract }) {
    appendPackEvalHint(contract, {
      packId: "system_itsm",
      expectedToolKinds: ["query", "action", "notification"],
      mustReferenceEntities: ["tickets", "incidents", "change_requests"],
      successCriteria: ["Use status, owner, created_at, and notes to prioritize remediation.", "Treat active or pending SLA-risk records as escalation candidates.", "Preserve audit trails for remediation actions."],
      refusalRules: ["Do not claim an incident is remediated or closed without ITSM status evidence."],
    });
  },
};
