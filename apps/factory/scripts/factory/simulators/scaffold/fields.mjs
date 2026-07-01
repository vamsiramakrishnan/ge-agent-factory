import { singularOf, titleCaseWords } from "./naming.mjs";

export function lifecycleField(fields) {
  for (const field of ["status", "state", "stage", "lifecycle_state"]) {
    if (fields.includes(field)) return field;
  }
  return "status";
}

export function lifecycleDefaults(fields) {
  const field = lifecycleField(fields);
  return fields.includes(field) ? { [field]: "active" } : {};
}

export function semanticTypeFor(field) {
  if (field.endsWith("_id") || ["id", "source_record_id"].includes(field)) return "string";
  if (/(^|_)count$|_count$|_qty$|^quantity$|^score$|^duration_seconds$|^duration_hours$|^member_count$|^row_count$|^audience_size$/.test(field)) return "integer";
  if (/^amount$|_amount$|^balance$|^budget$|^burn_rate$|^target$|^value$|^salary_band$/.test(field)) return "number";
  if (/^compliance_required$|^required$|^active$|^enabled$/.test(field)) return "boolean";
  if (field === "date" || field.endsWith("_date")) return "string";
  if (field === "at" || field.endsWith("_at")) return "string";
  return "string";
}

export function semanticFormatFor(field, type) {
  if (type !== "string") return null;
  if (field === "email" || field.endsWith("_email")) return "email";
  if (field === "date" || field.endsWith("_date")) return "date";
  if (field === "at" || field.endsWith("_at")) return "date-time";
  return null;
}

export function fieldSchema(field) {
  const type = semanticTypeFor(field);
  const schema = { type };
  const format = semanticFormatFor(field, type);
  if (format) schema.format = format;
  return schema;
}

export function idValue(field, index = 1) {
  const prefix = field
    .replace(/_id$/, "")
    .replace(/^id$/, "record")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "-");
  return `${prefix || "RECORD"}-${String(index).padStart(3, "0")}`;
}

export function sampleValueFor(field, collection, index = 1) {
  const type = semanticTypeFor(field);
  if (field.endsWith("_id") || ["id", "source_record_id"].includes(field)) return idValue(field, index);
  if (type === "integer") return field.includes("duration") ? 8 : field.includes("score") ? 82 : 125;
  if (type === "number") return field.includes("burn_rate") || field === "target" ? 0.95 : 125000;
  if (type === "boolean") return true;
  if (semanticFormatFor(field, type) === "date") return "2026-03-15";
  if (semanticFormatFor(field, type) === "date-time") return "2026-03-15T14:30:00Z";
  if (field === "email" || field.endsWith("_email")) return `${singularOf(collection).replace(/_/g, ".")}.${index}@example.com`;

  const lookup = {
    action: "review",
    account: "Operating Expense",
    assignee: "Priya Shah",
    assignment_group: "Enterprise Operations",
    author: "Morgan Lee",
    bank: "Global Treasury Bank",
    breach_risk: "low",
    carrier: "Aetna",
    category: "Indirect Materials",
    channel: "enterprise",
    classification: "confidential",
    clause_type: "termination",
    commander: "Alex Morgan",
    commodity: "precision components",
    company: "GE Aerospace",
    configuration_item: "payroll-api-prod",
    cost_center: "CC-4100",
    country: "US",
    criticality: "high",
    currency: "USD",
    department: "People Operations",
    domain: "operations",
    environment: "production",
    event_type: "life_event",
    feedback_state: "complete",
    framework: "SOX",
    freshness: "current",
    industry: "Manufacturing",
    jurisdiction: "US-FED",
    ledger: "US-GAAP",
    location: "Cincinnati, OH",
    manager_id: "MANAGER-001",
    model_version: "v2.4",
    outcome: "accepted",
    owner: "Jordan Rivera",
    payment_terms: "Net 45",
    period: "2026-Q1",
    plant: "PLANT-102",
    priority: "high",
    proficiency: "advanced",
    provider: "internal",
    query: "status = active",
    reason: "Quarterly business review",
    relationship: "spouse",
    requester: "Taylor Brooks",
    risk: "medium",
    risk_level: "medium",
    risk_tier: "tier_2",
    role: "manager",
    schedule: "daily",
    segment: "enterprise",
    severity: "medium",
    short_description: "Access request requires manager approval",
    sla: "P2 response",
    source: "employee_referral",
    state: "active",
    status: "active",
    stage: "qualified",
    summary: "Pending review for downstream workflow",
    text: "Standard commercial terms apply.",
    tier: "tier_1",
    title: titleCaseWords(collection),
    type: "standard",
    usage_rights: "internal_use",
    version: "2026.1",
    window: "30d",
    worker_type: "employee",
  };
  return lookup[field] || `${titleCaseWords(field)} ${index}`;
}
