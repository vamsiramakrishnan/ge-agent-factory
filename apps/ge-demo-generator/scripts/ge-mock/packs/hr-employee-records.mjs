import { appendPackEvalHint, findTableDef, hasAny, setIfColumn, tableRows, textOf } from "./pack-utils.mjs";

const EMPLOYEES = [
  ["EMP-0007", "Maya Chen", "active", "US"],
  ["EMP-0012", "Jordan Lee", "active", "US"],
  ["EMP-0021", "Priya Shah", "leave", "UK"],
  ["EMP-0034", "Alex Morgan", "terminated", "US"],
];

function seedEmployees(schema, generatedTables) {
  const tableDef = findTableDef(schema, "employees");
  const rows = tableRows(generatedTables, "employees");
  if (!tableDef || !rows.length) return;
  rows.slice(0, 4).forEach((row, index) => {
    const [id, name, status, region] = EMPLOYEES[index];
    setIfColumn(row, tableDef.columns, "id", id);
    setIfColumn(row, tableDef.columns, "source_record_id", id);
    setIfColumn(row, tableDef.columns, "name", name);
    setIfColumn(row, tableDef.columns, "employee_name", name);
    setIfColumn(row, tableDef.columns, "employment_status", status);
    setIfColumn(row, tableDef.columns, "status", status === "terminated" ? "closed" : "active");
    setIfColumn(row, tableDef.columns, "region", region);
    setIfColumn(row, tableDef.columns, "created_at", `2026-05-${String(5 + index).padStart(2, "0")}`);
  });
}

function seedHrTable(schema, generatedTables, tableName) {
  const tableDef = findTableDef(schema, tableName);
  const rows = tableRows(generatedTables, tableName);
  const employees = tableRows(generatedTables, "employees");
  if (!tableDef || !rows.length) return;
  rows.slice(0, 4).forEach((row, index) => {
    setIfColumn(row, tableDef.columns, "employee_id", employees[index]?.id || EMPLOYEES[index][0]);
    setIfColumn(row, tableDef.columns, "status", index === 3 ? "closed" : "active");
    setIfColumn(row, tableDef.columns, "owner", ["HR Ops", "Comp Partner", "HRBP", "People Analytics"][index]);
    setIfColumn(row, tableDef.columns, "created_at", `2026-05-${String(8 + index).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "notes", `${tableName} seeded with Workday employee reference and HR decision context.`);
  });
}

export const hrEmployeeRecordsPack = {
  id: "system_hr_employee_records",
  layer: "system",
  description: "Common employee/workforce record recipe for Workday-backed HR workflows.",
  departments: ["hr"],
  systems: ["workday"],
  capabilities: ["employee_records", "workforce", "manager_hierarchy", "fixture_recipe"],
  simulatorInterop: {
    archetypes: ["hr_talent", "benefits"],
    collections: ["workers", "positions", "supervisory_orgs", "worker_events", "employees", "life_events"],
    materializes: "employee, position, manager hierarchy, compensation, and life-event rows into HR simulator seeds",
  },
  match(context) {
    return hasAny(textOf(context), [/workday/, /employees/, /positions/, /compensation_records/, /life_events/]);
  },
  apply({ schema, generatedTables }) {
    seedEmployees(schema, generatedTables);
    seedHrTable(schema, generatedTables, "positions");
    seedHrTable(schema, generatedTables, "compensation_records");
    seedHrTable(schema, generatedTables, "life_events");
  },
  enrichContract({ contract }) {
    appendPackEvalHint(contract, {
      packId: "system_hr_employee_records",
      expectedToolKinds: ["query", "evidence_lookup"],
      mustReferenceEntities: ["employees", "positions", "compensation_records"],
      successCriteria: ["Anchor HR answers to employee status, region, and Workday record IDs.", "Escalate terminated, leave, or missing employee cases.", "Avoid using stale employee data for write-like actions."],
      refusalRules: ["Do not infer employee eligibility or employment status without Workday employee evidence."],
    });
  },
};
