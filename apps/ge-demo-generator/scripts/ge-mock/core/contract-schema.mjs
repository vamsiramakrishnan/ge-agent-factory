import { safePyName, snakeCase, titleCase } from "./naming.mjs";

export const CONTRACT_TOOL_KINDS = new Set(["action", "notification", "evidence_lookup", "calculation"]);
export const CONTRACT_INTENT_KINDS = new Set(["query", "action", "notification", "evidence_lookup", "calculation"]);

export function tablePrimaryKey(table) {
  return table?.primaryKey
    || (table?.columns || []).find((column) => column.type === "seq")?.name
    || (table?.columns || [])[0]?.name
    || "id";
}

function tableNameFromQueryIntent(intent) {
  const source = snakeCase(intent?.sourceSystemId || "");
  const name = snakeCase(intent?.name || "");
  let tail = name.replace(/^query_/, "");
  if (source && tail.startsWith(`${source}_`)) tail = tail.slice(source.length + 1);
  return tail || "records";
}

// The fully-qualified materialized table name: the source-specific tail prefixed
// with the source system id. Two query intents with the SAME tail but DIFFERENT
// source systems (e.g. query_workday_records + query_okta_records → tail
// "records") must NOT collapse onto one table, otherwise the generator emits a
// single backing table and canonicalIntentToolName resolves the second intent to
// the first system's tool (wrong system) and the second tool is never emitted.
// Source-qualifying the name keeps both tables distinct; tableToolName already
// strips/re-adds the source prefix, so emitted tool names do not churn.
function materializedTableName(intent) {
  const source = snakeCase(intent?.sourceSystemId || "");
  const tail = tableNameFromQueryIntent(intent);
  if (!source) return tail;
  if (tail === source || tail.startsWith(`${source}_`)) return tail;
  return snakeCase(`${source}_${tail}`);
}

function buildQueryTableFromIntent(intent, rows = 25) {
  const tableName = materializedTableName(intent);
  const columns = [
    { name: "id", type: "seq", pattern: `${tableName.slice(0, 3).toUpperCase()}-{n:4}` },
    { name: "source_record_id", type: "seq", pattern: `${snakeCase(intent.sourceSystemId || "src").slice(0, 4).toUpperCase()}-{n:4}` },
  ];
  for (const input of intent.requiredInputs || []) {
    const name = snakeCase(input);
    if (!name || columns.some((column) => column.name === name)) continue;
    if (name.endsWith("_id") && name !== "employee_id") columns.push({ name, type: "string" });
    else if (name === "employee_id") columns.push({ name, type: "ref", ref: "employees.id" });
    else if (name.includes("date")) columns.push({ name, type: "date", min: "2025-01-01", max: "2026-06-01" });
    else columns.push({ name, type: "string" });
  }
  if (/life_events?/.test(tableName)) {
    if (!columns.some((column) => column.name === "employee_id")) columns.push({ name: "employee_id", type: "ref", ref: "employees.id" });
    columns.push(
      { name: "event_type", type: "enum", values: ["birth_of_child", "marriage", "move", "loss_of_coverage"] },
      { name: "event_date", type: "date", min: "2025-01-01", max: "2026-06-01" },
      { name: "window_days", type: "number", min: 30, max: 60 },
      { name: "status", type: "enum", values: ["open", "expired", "approved", "needs_documentation"], weights: [0.55, 0.2, 0.15, 0.1] },
    );
  } else if (columns.length <= 2) {
    columns.push(
      { name: "status", type: "enum", values: ["active", "pending", "closed"] },
      { name: "notes", type: "lorem.sentence" },
    );
  }
  return {
    name: tableName,
    rows,
    columns,
    _sourceSystem: titleCase(intent.sourceSystemId || "Source System"),
    _sourceSystemId: intent.sourceSystemId || "source_system",
    _sourceKind: "generated_contract_table",
    _sourceProtocol: "fixture",
    _sourceDescription: intent.description || `Generated backing table for ${intent.name}`,
    _generatedFromIntent: intent.name,
  };
}

export function ensureContractQueryTables(schema) {
  const behavior = schema?.useCaseSpec?.behaviorContract || null;
  const intents = (behavior?.toolIntents || []).filter((intent) => intent?.kind === "query" && intent.name);
  if (!intents.length) return schema;
  const existingNames = new Set((schema.tables || []).map((table) => snakeCase(table.name)));
  const defaultRows = schema.rowPolicy?.defaultRowsPerEntity || schema.useCaseSpec?.rowPolicy?.defaultRowsPerEntity || 25;
  const additions = [];
  for (const intent of intents) {
    // Dedup by the source-qualified table name so two intents sharing a name tail
    // across DIFFERENT source systems each materialize their own backing table.
    const tableName = materializedTableName(intent);
    if (existingNames.has(snakeCase(tableName))) continue;
    const table = buildQueryTableFromIntent(intent, defaultRows);
    additions.push(table);
    existingNames.add(snakeCase(table.name));
  }
  if (!additions.length) return schema;
  schema.tables = [...(schema.tables || []), ...additions];
  if (schema.useCaseSpec) {
    schema.useCaseSpec.dataContracts = [
      ...(schema.useCaseSpec.dataContracts || []),
      ...additions.map((table) => ({
        entity: table.name,
        sourceSystem: table._sourceSystem,
        sourceSystemId: table._sourceSystemId,
        sourceKind: table._sourceKind,
        rows: table.rows,
        primaryKey: tablePrimaryKey(table),
        columns: table.columns.map((column) => ({
          name: column.name,
          type: column.type,
          ref: column.ref || null,
          required: true,
        })),
      })),
    ];
  }
  return schema;
}

export function inferEvalToolArgs(evalSpec, intent) {
  const prompt = String(evalSpec?.prompt || "");
  const args = {};
  const required = (intent?.requiredInputs || []).map((input) => snakeCase(input));
  const employeeId = prompt.match(/\bEMP[-_]\d{3,}\b/i)?.[0]?.replace("_", "-").toUpperCase();
  for (const input of required) {
    if (input === "employee_id" && employeeId) args.employee_id = employeeId;
    if (input === "coverage_tier" && /\bfamily\b/i.test(prompt)) args.coverage_tier = "family";
    if (input === "coverage_tier" && /employee only/i.test(prompt)) args.coverage_tier = "employee_only";
    if (input === "plan_id" && /standard ppo/i.test(prompt)) args.plan_id = "PLAN-STANDARD-PPO-FAMILY";
    if ((input === "plan_name" || input === "plan") && /standard ppo/i.test(prompt)) args[input] = "Standard PPO";
    if ((input === "plan_name" || input === "plan") && /gold ppo/i.test(prompt)) args[input] = "Gold PPO";
    if (/anchor|citation|section|topic/.test(input)) {
      const cited = (evalSpec.mustCiteDocuments || []).join(" ").toLowerCase();
      if (String(intent?.name || "").includes("life_event") || cited.includes("life-event")) args[input] = "qle-window";
      else if (cited.includes("open-enrollment") || String(intent?.name || "").includes("open_enrollment")) args[input] = "eligibility-window";
    }
  }
  if (safePyName(intent?.name || "") === "action_google_chat_notify_employee") {
    if (employeeId) args.employee_id = employeeId;
    args.enrollment_id = args.enrollment_id || "ENROLLME-EXPECTED";
    args.audit_trail = args.audit_trail || "AUDIT_TR-EXPECTED";
  }
  return Object.fromEntries(Object.entries(args).filter(([, value]) => value !== undefined && value !== ""));
}
