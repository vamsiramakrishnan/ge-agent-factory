// Source-system → lakehouse-target classification + per-entity column derivation for
// the mock-data planner. Extracted from plan-mock-data.mjs verbatim — pure functions,
// byte output identical to the former inline helpers.

import { snakeCase } from "@ge/std/naming";

export function sourceKindForSystem(system = {}) {
  const text = `${system.id || ""} ${system.name || ""} ${(system.owns || []).join(" ")} ${system.protocol || ""}`.toLowerCase();
  if (/document|policy|runbook|guide|pdf|gcs|object/.test(text)) return "document_store";
  if (/bigquery|warehouse|analytics|metric|fact/.test(text)) return "analytics_warehouse";
  if (/chat|slack|email|event|notification/.test(text)) return "collaboration_event";
  if (/model|vertex|ai/.test(text)) return "ai_or_model";
  return "operational";
}

export function lakehouseClass(source) {
  if (source.dataKind === "analytics_warehouse") return "olap";
  if (source.dataKind === "document_store") return "unstructured_blob";
  if (source.dataKind === "collaboration_event") return "nosql_event";
  if (source.dataKind === "external_feed") return "olap";
  if (source.dataKind === "ai_or_model") return "runtime";
  return "oltp";
}

export function targetFor(source) {
  const cls = lakehouseClass(source);
  if (cls === "oltp") {
    return {
      class: "OLTP",
      datastore: "alloydb",
      primary: "AlloyDB for PostgreSQL",
      fallback: "Cloud SQL PostgreSQL",
      reason: "Operational source records need SQL constraints, joins, transactions, and update semantics.",
    };
  }
  if (cls === "nosql_event") {
    return {
      class: "OLTP_NOSQL",
      datastore: "firestore",
      primary: "Firestore",
      fallback: "Bigtable for high-volume event streams",
      reason: "Chat, notification, calendar, and workflow events are document/event-shaped and often key-value/time-series accessed.",
    };
  }
  if (cls === "olap") {
    return {
      class: "OLAP",
      datastore: "bigquery",
      primary: "BigQuery",
      fallback: "BigQuery external table over Cloud Storage",
      reason: "Metrics, feeds, model outputs, snapshots, and analytical facts belong in columnar warehouse storage.",
    };
  }
  if (cls === "unstructured_blob") {
    return {
      class: "UNSTRUCTURED_BLOB",
      datastore: "gcs",
      primary: "Cloud Storage",
      fallback: "Document AI / Vertex AI Search indexing later",
      reason: "PDF, DOCX, markdown, and long-form evidence should remain object files with metadata manifests.",
    };
  }
  return {
    class: "RUNTIME",
    datastore: "vertex_ai",
    primary: "Vertex AI / ADK runtime",
    fallback: "Local mock model response fixtures",
    reason: "AI/model systems are execution dependencies, not source-data stores.",
  };
}

export function entitiesFor(source) {
  const text = `${source.system} ${source.description}`.toLowerCase();
  if (/workday|employee|worker|hris/.test(text)) return ["employees", "employment_profiles", "life_events", "job_assignments"];
  if (/drive|docs|document|policy|pdf|guide|spd/.test(text)) return ["documents", "document_sections", "document_citations"];
  if (/benefit|benefitfocus/.test(text)) return ["benefit_plans", "eligibility_rules", "enrollments", "carrier_sync_events"];
  if (/chat|slack|email|gmail/.test(text)) return ["messages", "notifications", "delivery_events"];
  if (/salesforce|crm|account|opportunit|contact|lead/.test(text)) return ["accounts", "contacts", "opportunities", "activities"];
  if (/servicenow|ticket|incident|request|cmdb/.test(text)) return ["tickets", "cmdb_items", "incidents", "approvals"];
  if (/sap|invoice|journal|gl|payment|vendor/.test(text)) return ["vendors", "invoices", "journal_entries", "payments"];
  if (/coupa|ariba|supplier|procure|purchase/.test(text)) return ["suppliers", "purchase_orders", "contracts", "spend_facts"];
  if (/bigquery|analytics|metric|score|forecast|dashboard/.test(text)) return ["metric_snapshots", "score_outputs", "fact_events"];
  return [`${snakeCase(source.system)}_records`];
}

export function columnSet(entity) {
  if (entity === "employees") return ["id", "source_record_id", "name", "email", "department", "region", "status", "life_event", "dependents"];
  if (entity === "benefit_plans") return ["id", "carrier", "plan_name", "coverage_tier", "monthly_premium", "deductible", "network_type", "status"];
  if (entity === "eligibility_rules") return ["id", "rule_name", "employee_status", "region", "waiting_days", "life_event_window_days"];
  if (entity === "enrollments") return ["id", "employee_id", "plan_id", "coverage_tier", "effective_date", "status", "audit_trail"];
  if (entity === "carrier_sync_events") return ["id", "enrollment_id", "carrier", "sync_status", "sync_date", "source_record_id"];
  if (entity === "messages" || entity === "notifications" || entity === "delivery_events") return ["id", "actor_id", "channel", "recipient", "body", "created_at", "delivery_status"];
  if (entity === "documents") return ["id", "title", "mime_type", "storage_uri", "source_system", "created_at", "checksum"];
  if (entity === "document_sections") return ["id", "document_id", "heading", "body", "page_number"];
  if (entity === "document_citations") return ["id", "document_id", "section_id", "quote", "source_uri"];
  if (entity.includes("metric") || entity.includes("score") || entity.includes("fact")) return ["id", "entity_id", "metric_name", "metric_value", "period_start", "period_end", "source_system"];
  return ["id", "source_record_id", "name", "status", "created_at", "updated_at", "audit_trail"];
}

export function referenceTargetFor(column, { availableObjects = new Set(), currentObject = null } = {}) {
  const candidates = {
    employee_id: ["employees"],
    actor_id: ["employees", "users", "accounts"],
    plan_id: ["benefit_plans"],
    enrollment_id: ["enrollments"],
    document_id: ["documents"],
    section_id: ["document_sections"],
    entity_id: ["employees", "accounts", "vendors", "suppliers", "invoices", "contracts", "purchase_orders", "bank_accounts", "datasets"],
  }[column] || [];
  for (const candidate of candidates) {
    if (candidate !== currentObject && availableObjects.has(candidate)) return candidate;
  }
  return null;
}
