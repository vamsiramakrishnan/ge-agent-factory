#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const REGISTRY_PATH = "apps/factory/simulator-systems/registry.json";

const ARCHETYPES = {
  hr_talent: {
    family: "hr-talent",
    entities: ["worker", "position", "supervisory_org", "job_requisition", "worker_event", "approval"],
    workflows: ["worker_search", "job_change", "manager_approval", "org_lookup", "audit"],
    roles: ["employee", "manager", "hr_partner", "recruiter", "comp_partner"],
    collections: {
      workers: ["worker_id", "employee_id", "name", "email", "status", "worker_type", "position_id", "manager_id", "supervisory_org_id", "cost_center", "location", "country"],
      positions: ["position_id", "title", "job_profile", "status", "supervisory_org_id", "cost_center", "location", "worker_id"],
      supervisory_orgs: ["org_id", "name", "manager_id", "parent_org_id", "cost_center", "company"],
      job_requisitions: ["requisition_id", "position_id", "status", "recruiter", "hiring_manager_id", "target_start_date"],
      worker_events: ["event_id", "worker_id", "event_type", "status", "reason", "effective_date"],
      approvals: ["approval_id", "source_record_id", "approver", "state", "reason"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["worker", ["workers", "positions", "supervisory_orgs"], "workers"],
      ["requisition", ["job_requisitions"], "job_requisitions"],
      ["approval", ["approvals", "worker_events"], "worker_events"],
    ],
  },
  recruiting: {
    family: "hr-talent",
    entities: ["candidate", "application", "job", "interview", "offer", "approval"],
    workflows: ["candidate_search", "application_review", "interview_scheduling", "offer_approval", "audit"],
    roles: ["recruiter", "hiring_manager", "interviewer", "comp_partner", "candidate_coordinator"],
    collections: {
      candidates: ["candidate_id", "name", "email", "status", "location", "source", "current_employer"],
      jobs: ["job_id", "title", "department", "location", "status", "hiring_manager"],
      applications: ["application_id", "candidate_id", "job_id", "stage", "status", "recruiter"],
      interviews: ["interview_id", "application_id", "interviewer", "status", "scheduled_at", "feedback_state"],
      offers: ["offer_id", "application_id", "status", "salary_band", "start_date"],
      approvals: ["approval_id", "source_record_id", "approver", "state", "reason"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["candidate", ["candidates", "applications"], "candidates"],
      ["job", ["jobs"], "jobs"],
      ["approval", ["offers", "approvals"], "offers"],
    ],
  },
  learning: {
    family: "hr-talent",
    entities: ["learner", "course", "enrollment", "certification", "skill"],
    workflows: ["course_search", "enrollment_update", "certification_tracking", "skill_gap_review", "audit"],
    roles: ["learner", "manager", "learning_admin", "compliance_owner"],
    collections: {
      learners: ["learner_id", "name", "email", "status", "department", "manager_id"],
      courses: ["course_id", "title", "status", "provider", "duration_hours", "compliance_required"],
      enrollments: ["enrollment_id", "learner_id", "course_id", "status", "due_date", "completion_date"],
      certifications: ["certification_id", "learner_id", "name", "status", "expiration_date"],
      skills: ["skill_id", "learner_id", "name", "proficiency", "verified_at"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["learning", ["learners", "courses", "enrollments"], "enrollments"],
      ["skill", ["skills", "certifications"], "skills"],
    ],
  },
  benefits: {
    family: "hr-benefits",
    entities: ["employee", "dependent", "benefit_plan", "enrollment", "life_event", "approval"],
    workflows: ["eligibility_lookup", "life_event_review", "enrollment_update", "dependent_verification", "audit"],
    roles: ["employee", "benefits_admin", "manager", "auditor"],
    collections: {
      employees: ["employee_id", "name", "email", "status", "country", "pay_group", "eligibility_group"],
      dependents: ["dependent_id", "employee_id", "name", "relationship", "status", "verification_state"],
      benefit_plans: ["plan_id", "name", "plan_type", "status", "country", "carrier"],
      enrollments: ["enrollment_id", "employee_id", "plan_id", "status", "coverage_level", "effective_date"],
      life_events: ["life_event_id", "employee_id", "event_type", "status", "event_date"],
      approvals: ["approval_id", "source_record_id", "approver", "state", "reason"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["worker", ["employees", "dependents"], "employees"],
      ["benefit", ["benefit_plans", "enrollments", "life_events"], "enrollments"],
      ["approval", ["approvals"], "approvals"],
    ],
  },
  procurement: {
    family: "procurement",
    entities: ["supplier", "purchase_order", "requisition", "contract", "approval", "spend_fact"],
    workflows: ["supplier_search", "requisition_approval", "po_review", "contract_lookup", "audit"],
    roles: ["buyer", "category_manager", "approver", "supplier_manager"],
    collections: {
      suppliers: ["supplier_id", "name", "status", "risk_tier", "country", "category"],
      purchase_orders: ["po_id", "supplier_id", "status", "amount", "currency", "requester"],
      requisitions: ["requisition_id", "supplier_id", "status", "amount", "cost_center"],
      contracts: ["contract_id", "supplier_id", "status", "effective_date", "expiration_date"],
      approvals: ["approval_id", "source_record_id", "approver", "state", "reason"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["supplier", ["suppliers"], "suppliers"],
      ["purchase_order", ["purchase_orders", "requisitions"], "purchase_orders"],
      ["contract", ["contracts"], "contracts"],
      ["approval", ["approvals"], "approvals"],
    ],
  },
  supply_chain: {
    family: "supply-chain",
    entities: ["supplier", "material", "shipment", "purchase_order", "inventory_position", "risk_event"],
    workflows: ["supplier_lookup", "shipment_update", "inventory_exception", "risk_review", "audit"],
    roles: ["planner", "buyer", "supplier_manager", "logistics_coordinator", "risk_owner"],
    collections: {
      suppliers: ["supplier_id", "name", "status", "risk_tier", "country", "category"],
      materials: ["material_id", "name", "status", "commodity", "plant", "criticality"],
      shipments: ["shipment_id", "supplier_id", "material_id", "status", "eta", "quantity", "carrier"],
      purchase_orders: ["po_id", "supplier_id", "material_id", "status", "quantity", "need_by_date"],
      inventory_positions: ["inventory_id", "material_id", "plant", "status", "on_hand_qty", "safety_stock_qty"],
      risk_events: ["risk_event_id", "supplier_id", "event_type", "status", "severity", "detected_at"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["supplier", ["suppliers", "risk_events"], "suppliers"],
      ["material", ["materials", "inventory_positions"], "materials"],
      ["purchase_order", ["purchase_orders", "shipments"], "purchase_orders"],
    ],
  },
  erp_finance: {
    family: "finance-erp",
    entities: ["vendor", "invoice", "journal_entry", "payment", "cost_center", "approval"],
    workflows: ["invoice_review", "journal_approval", "payment_status", "close_audit"],
    roles: ["ap_analyst", "controller", "finance_manager", "auditor"],
    collections: {
      vendors: ["vendor_id", "name", "status", "country", "payment_terms"],
      invoices: ["invoice_id", "vendor_id", "status", "amount", "currency", "due_date"],
      journal_entries: ["journal_id", "status", "ledger", "period", "amount"],
      payments: ["payment_id", "invoice_id", "status", "payment_date", "amount"],
      approvals: ["approval_id", "source_record_id", "approver", "state", "reason"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["finance", ["vendors", "invoices", "journal_entries", "payments"], "invoices"],
      ["ledger", ["journal_entries"], "journal_entries"],
      ["approval", ["approvals"], "approvals"],
    ],
  },
  planning_epm: {
    family: "planning-epm",
    entities: ["planning_model", "scenario", "forecast_line", "budget_owner", "approval"],
    workflows: ["scenario_review", "forecast_update", "budget_approval", "variance_audit"],
    roles: ["planner", "finance_manager", "budget_owner", "controller"],
    collections: {
      planning_models: ["model_id", "name", "status", "period", "currency"],
      scenarios: ["scenario_id", "model_id", "name", "status", "version", "owner"],
      forecast_lines: ["forecast_line_id", "scenario_id", "cost_center", "account", "amount", "currency", "status"],
      budget_owners: ["owner_id", "name", "email", "cost_center", "status"],
      approvals: ["approval_id", "source_record_id", "approver", "state", "reason"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["finance", ["planning_models", "scenarios", "forecast_lines"], "forecast_lines"],
      ["approval", ["approvals"], "approvals"],
    ],
  },
  tax_treasury: {
    family: "finance-treasury-tax",
    entities: ["bank_account", "payment_batch", "cash_position", "tax_filing", "approval"],
    workflows: ["cash_position_review", "payment_release", "tax_filing_status", "bank_exception", "audit"],
    roles: ["treasury_analyst", "tax_manager", "controller", "approver", "auditor"],
    collections: {
      bank_accounts: ["bank_account_id", "name", "status", "bank", "currency", "country"],
      payment_batches: ["batch_id", "bank_account_id", "status", "amount", "currency", "release_date"],
      cash_positions: ["cash_position_id", "bank_account_id", "status", "as_of_date", "balance", "currency"],
      tax_filings: ["filing_id", "jurisdiction", "period", "status", "due_date", "amount"],
      approvals: ["approval_id", "source_record_id", "approver", "state", "reason"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["finance", ["bank_accounts", "payment_batches", "cash_positions"], "cash_positions"],
      ["tax", ["tax_filings"], "tax_filings"],
      ["approval", ["approvals"], "approvals"],
    ],
  },
  crm: {
    family: "crm",
    entities: ["account", "contact", "opportunity", "activity", "campaign"],
    workflows: ["account_search", "opportunity_review", "activity_logging", "forecast_update"],
    roles: ["seller", "sales_manager", "marketing_ops", "revops"],
    collections: {
      accounts: ["account_id", "name", "industry", "segment", "status"],
      contacts: ["contact_id", "account_id", "name", "email", "role"],
      opportunities: ["opportunity_id", "account_id", "stage", "amount", "close_date"],
      activities: ["activity_id", "account_id", "type", "status", "created_at"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["account", ["accounts", "contacts"], "accounts"],
      ["opportunity", ["opportunities"], "opportunities"],
      ["activity", ["activities"], "activities"],
    ],
  },
  marketing_automation: {
    family: "crm-marketing",
    entities: ["lead", "account", "campaign", "journey", "email_event", "segment"],
    workflows: ["lead_search", "campaign_review", "journey_activation", "segment_sync", "audit"],
    roles: ["marketing_ops", "campaign_manager", "revops", "sales_owner"],
    collections: {
      leads: ["lead_id", "name", "email", "status", "score", "source", "account_id"],
      accounts: ["account_id", "name", "industry", "segment", "status"],
      campaigns: ["campaign_id", "name", "status", "channel", "budget", "owner"],
      journeys: ["journey_id", "campaign_id", "status", "audience_size", "activation_date"],
      email_events: ["event_id", "lead_id", "campaign_id", "event_type", "status", "occurred_at"],
      segments: ["segment_id", "name", "status", "criteria", "member_count"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["lead", ["leads", "accounts"], "leads"],
      ["campaign", ["campaigns", "journeys", "email_events", "segments"], "campaigns"],
    ],
  },
  digital_analytics: {
    family: "digital-analytics",
    entities: ["property", "event", "conversion", "audience", "experiment"],
    workflows: ["property_lookup", "conversion_review", "audience_update", "experiment_status", "audit"],
    roles: ["analyst", "marketing_ops", "growth_manager", "data_owner"],
    collections: {
      properties: ["property_id", "name", "status", "channel", "owner"],
      events: ["event_id", "property_id", "event_name", "status", "occurred_at", "count"],
      conversions: ["conversion_id", "property_id", "name", "status", "value", "currency"],
      audiences: ["audience_id", "name", "status", "member_count", "source"],
      experiments: ["experiment_id", "property_id", "name", "status", "start_date", "end_date"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["analytics", ["properties", "events", "conversions"], "events"],
      ["audience", ["audiences", "experiments"], "audiences"],
    ],
  },
  clm: {
    family: "contract-lifecycle",
    entities: ["agreement", "clause", "obligation", "amendment", "approval"],
    workflows: ["agreement_lookup", "clause_review", "obligation_tracking", "approval"],
    roles: ["contract_manager", "legal_reviewer", "business_owner", "approver"],
    collections: {
      agreements: ["agreement_id", "name", "counterparty", "status", "effective_date", "expiration_date"],
      clauses: ["clause_id", "agreement_id", "clause_type", "risk_level", "text"],
      obligations: ["obligation_id", "agreement_id", "owner", "status", "due_date"],
      amendments: ["amendment_id", "agreement_id", "status", "effective_date"],
      approvals: ["approval_id", "source_record_id", "approver", "state", "reason"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["contract", ["agreements", "clauses", "obligations", "amendments"], "agreements"],
      ["approval", ["approvals"], "approvals"],
    ],
  },
  identity: {
    family: "identity-security",
    entities: ["user", "group", "application", "entitlement", "access_request", "approval"],
    workflows: ["access_search", "access_request", "approval", "audit"],
    roles: ["requester", "manager", "identity_admin", "security_reviewer"],
    collections: {
      users: ["user_id", "name", "email", "status", "department"],
      groups: ["group_id", "name", "owner", "risk_tier"],
      applications: ["application_id", "name", "owner", "criticality"],
      entitlements: ["entitlement_id", "application_id", "name", "risk_tier"],
      access_requests: ["request_id", "user_id", "application_id", "status", "reason"],
      approvals: ["approval_id", "source_record_id", "approver", "state", "reason"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["identity", ["users", "groups", "applications", "entitlements"], "users"],
      ["approval", ["approvals", "access_requests"], "access_requests"],
    ],
  },
  itsm: {
    family: "it-ops-security",
    entities: ["ticket", "service_request", "change_request", "cmdb_ci", "approval", "sla"],
    workflows: ["incident_triage", "request_fulfillment", "change_approval", "sla_escalation", "audit"],
    roles: ["requester", "resolver", "change_manager", "service_owner"],
    collections: {
      tickets: ["ticket_id", "type", "short_description", "state", "priority", "assignment_group", "requester", "configuration_item", "sla"],
      cmdb_items: ["ci_id", "name", "type", "status", "owner", "criticality"],
      changes: ["change_id", "ticket_id", "state", "risk", "planned_start", "planned_end"],
      slas: ["sla_id", "ticket_id", "state", "target_time", "breach_risk"],
      approvals: ["approval_id", "source_record_id", "approver", "state", "reason"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["ticket", ["tickets", "changes", "slas"], "tickets"],
      ["cmdb", ["cmdb_items"], "cmdb_items"],
      ["approval", ["approvals"], "approvals"],
    ],
  },
  security: {
    family: "it-security",
    entities: ["asset", "finding", "incident", "control", "exception", "approval"],
    workflows: ["finding_triage", "incident_update", "exception_approval", "control_review", "audit"],
    roles: ["security_analyst", "incident_commander", "control_owner", "risk_approver"],
    collections: {
      assets: ["asset_id", "name", "status", "owner", "criticality", "environment"],
      findings: ["finding_id", "asset_id", "status", "severity", "source", "detected_at"],
      incidents: ["incident_id", "status", "severity", "commander", "opened_at", "summary"],
      controls: ["control_id", "name", "status", "owner", "framework"],
      exceptions: ["exception_id", "finding_id", "status", "requester", "expiration_date"],
      approvals: ["approval_id", "source_record_id", "approver", "state", "reason"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["asset", ["assets", "findings"], "assets"],
      ["incident", ["incidents"], "incidents"],
      ["risk", ["controls", "exceptions", "approvals"], "exceptions"],
    ],
  },
  observability: {
    family: "it-observability",
    entities: ["service", "monitor", "alert", "incident", "slo"],
    workflows: ["alert_triage", "incident_status", "slo_review", "monitor_update", "audit"],
    roles: ["sre", "service_owner", "incident_commander", "platform_admin"],
    collections: {
      services: ["service_id", "name", "status", "owner", "tier", "environment"],
      monitors: ["monitor_id", "service_id", "name", "status", "severity", "query"],
      alerts: ["alert_id", "monitor_id", "state", "severity", "triggered_at", "summary"],
      incidents: ["incident_id", "service_id", "status", "severity", "commander", "started_at"],
      slos: ["slo_id", "service_id", "status", "target", "window", "burn_rate"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["service", ["services", "slos"], "services"],
      ["incident", ["alerts", "incidents"], "incidents"],
    ],
  },
  project_work: {
    family: "work-management",
    entities: ["project", "issue", "task", "sprint", "release", "approval"],
    workflows: ["issue_triage", "task_update", "release_approval", "sprint_review", "audit"],
    roles: ["project_manager", "engineer", "product_owner", "release_manager", "approver"],
    collections: {
      projects: ["project_id", "name", "status", "owner", "department"],
      issues: ["issue_id", "project_id", "status", "priority", "assignee", "summary"],
      tasks: ["task_id", "issue_id", "status", "assignee", "due_date"],
      sprints: ["sprint_id", "project_id", "state", "start_date", "end_date"],
      releases: ["release_id", "project_id", "status", "version", "release_date"],
      approvals: ["approval_id", "source_record_id", "approver", "state", "reason"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["project", ["projects", "issues", "tasks"], "issues"],
      ["release", ["releases", "approvals"], "releases"],
    ],
  },
  risk_grc: {
    family: "risk-grc",
    entities: ["risk", "control", "issue", "policy", "assessment", "approval"],
    workflows: ["risk_review", "control_attestation", "issue_remediation", "policy_exception", "audit"],
    roles: ["risk_owner", "control_owner", "auditor", "compliance_manager", "approver"],
    collections: {
      risks: ["risk_id", "name", "status", "severity", "owner", "domain"],
      controls: ["control_id", "risk_id", "name", "status", "owner", "framework"],
      issues: ["issue_id", "control_id", "status", "severity", "remediation_owner", "due_date"],
      policies: ["policy_id", "name", "status", "owner", "effective_date"],
      assessments: ["assessment_id", "risk_id", "status", "assessor", "period"],
      approvals: ["approval_id", "source_record_id", "approver", "state", "reason"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["risk", ["risks", "controls", "issues"], "risks"],
      ["policy", ["policies", "assessments"], "policies"],
      ["approval", ["approvals"], "approvals"],
    ],
  },
  content_cms: {
    family: "content-cms",
    entities: ["asset", "content_item", "workflow_task", "campaign", "approval"],
    workflows: ["asset_lookup", "content_review", "publishing_approval", "campaign_asset_sync", "audit"],
    roles: ["content_author", "brand_manager", "legal_reviewer", "publisher", "approver"],
    collections: {
      assets: ["asset_id", "name", "status", "asset_type", "owner", "usage_rights"],
      content_items: ["content_id", "asset_id", "title", "status", "channel", "publish_date"],
      workflow_tasks: ["task_id", "content_id", "status", "assignee", "due_date"],
      campaigns: ["campaign_id", "name", "status", "channel", "owner"],
      approvals: ["approval_id", "source_record_id", "approver", "state", "reason"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["content", ["assets", "content_items", "workflow_tasks"], "content_items"],
      ["campaign", ["campaigns"], "campaigns"],
      ["approval", ["approvals"], "approvals"],
    ],
  },
  collaboration_docs: {
    family: "collaboration-document",
    entities: ["workspace", "document", "comment", "task", "approval"],
    workflows: ["document_search", "comment_review", "task_update", "approval", "audit"],
    roles: ["author", "reviewer", "approver", "workspace_admin"],
    collections: {
      workspaces: ["workspace_id", "name", "status", "owner", "department"],
      documents: ["document_id", "workspace_id", "title", "status", "owner", "modified_at"],
      comments: ["comment_id", "document_id", "author", "status", "created_at"],
      tasks: ["task_id", "document_id", "status", "assignee", "due_date"],
      approvals: ["approval_id", "source_record_id", "approver", "state", "reason"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["document", ["workspaces", "documents", "comments", "tasks"], "documents"],
      ["approval", ["approvals"], "approvals"],
    ],
  },
  data_platform: {
    family: "data-platform",
    entities: ["dataset", "table", "pipeline", "job", "data_quality_check"],
    workflows: ["dataset_lookup", "pipeline_update", "job_status", "quality_exception", "audit"],
    roles: ["data_engineer", "data_owner", "analyst", "platform_admin"],
    collections: {
      datasets: ["dataset_id", "name", "status", "owner", "domain", "classification"],
      tables: ["table_id", "dataset_id", "name", "status", "row_count", "freshness"],
      pipelines: ["pipeline_id", "dataset_id", "status", "schedule", "owner"],
      jobs: ["job_id", "pipeline_id", "state", "started_at", "duration_seconds"],
      quality_checks: ["check_id", "table_id", "status", "severity", "last_run_at"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["dataset", ["datasets", "tables"], "datasets"],
      ["pipeline", ["pipelines", "jobs", "quality_checks"], "pipelines"],
    ],
  },
  external_intelligence: {
    family: "external-intelligence",
    entities: ["company", "signal", "watchlist", "risk_score", "source_feed"],
    workflows: ["company_lookup", "signal_review", "watchlist_update", "risk_score_refresh", "audit"],
    roles: ["analyst", "risk_manager", "category_manager", "finance_owner"],
    collections: {
      companies: ["company_id", "name", "status", "country", "industry"],
      signals: ["signal_id", "company_id", "status", "signal_type", "severity", "detected_at"],
      watchlists: ["watchlist_id", "name", "status", "owner", "domain"],
      risk_scores: ["score_id", "company_id", "status", "score", "model_version", "as_of_date"],
      source_feeds: ["feed_id", "name", "status", "provider", "last_refresh_at"],
      audit_events: ["event_id", "action", "entity", "entity_id", "outcome"],
    },
    projection: [
      ["supplier", ["companies", "signals", "risk_scores"], "companies"],
      ["external_feed", ["source_feeds", "watchlists"], "source_feeds"],
    ],
  },
};

function parseArgs(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (!argv[i].startsWith("--")) continue;
    const key = argv[i].slice(2);
    flags[key] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
  }
  return flags;
}

function snakeCase(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

function singularOf(collection) {
  if (collection.endsWith("ies")) return `${collection.slice(0, -3)}y`;
  if (collection.endsWith("sses")) return collection.slice(0, -2);
  if (collection.endsWith("s")) return collection.slice(0, -1);
  return collection;
}

function lifecycleField(fields) {
  for (const field of ["status", "state", "stage", "lifecycle_state"]) {
    if (fields.includes(field)) return field;
  }
  return "status";
}

function lifecycleDefaults(fields) {
  const field = lifecycleField(fields);
  return fields.includes(field) ? { [field]: "active" } : {};
}

function semanticTypeFor(field) {
  if (field.endsWith("_id") || ["id", "source_record_id"].includes(field)) return "string";
  if (/(^|_)count$|_count$|_qty$|^quantity$|^score$|^duration_seconds$|^duration_hours$|^member_count$|^row_count$|^audience_size$/.test(field)) return "integer";
  if (/^amount$|_amount$|^balance$|^budget$|^burn_rate$|^target$|^value$|^salary_band$/.test(field)) return "number";
  if (/^compliance_required$|^required$|^active$|^enabled$/.test(field)) return "boolean";
  if (field === "date" || field.endsWith("_date")) return "string";
  if (field === "at" || field.endsWith("_at")) return "string";
  return "string";
}

function semanticFormatFor(field, type) {
  if (type !== "string") return null;
  if (field === "email" || field.endsWith("_email")) return "email";
  if (field === "date" || field.endsWith("_date")) return "date";
  if (field === "at" || field.endsWith("_at")) return "date-time";
  return null;
}

function fieldSchema(field) {
  const type = semanticTypeFor(field);
  const schema = { type };
  const format = semanticFormatFor(field, type);
  if (format) schema.format = format;
  return schema;
}

function idValue(field, index = 1) {
  const prefix = field
    .replace(/_id$/, "")
    .replace(/^id$/, "record")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "-");
  return `${prefix || "RECORD"}-${String(index).padStart(3, "0")}`;
}

function titleCaseWords(field) {
  return field
    .replace(/_id$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function sampleValueFor(field, collection, index = 1) {
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

async function readJson(path, fallback = null) {
  try { return JSON.parse(await readFile(path, "utf8")); }
  catch { return fallback; }
}

async function writeJson(path, data) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function schemaFor(id, archetype) {
  return {
    id: `${id}_schema`,
    version: 1,
    collections: Object.fromEntries(Object.entries(archetype.collections).map(([collection, fields]) => [
      collection,
      {
        primaryKey: fields[0],
        fields: Object.fromEntries(fields.map((field) => [field, fieldSchema(field)])),
      },
    ])),
  };
}

function toolsFor(id, archetype) {
  const collections = Object.keys(archetype.collections);
  const primary = collections[0];
  const primaryKey = archetype.collections[primary][0];
  const singular = singularOf(primary);
  const stateField = lifecycleField(archetype.collections[primary]);
  const tools = [
    {
      name: `search_${primary}`,
      description: `Search ${primary} in ${id}.`,
      inputSchema: { type: "object", properties: { query: { type: "string" }, status: { type: "string" }, limit: { type: "integer" } } },
    },
    {
      name: `get_${singular}`,
      description: `Get one ${singular} in ${id}.`,
      inputSchema: { type: "object", properties: { [primaryKey]: { type: "string" } }, required: [primaryKey] },
    },
    {
      name: `submit_${singular}_update`,
      description: `Submit an update to one ${singular} in ${id}.`,
      inputSchema: {
        type: "object",
        properties: {
          [primaryKey]: { type: "string" },
          [stateField]: { type: "string" },
          note: { type: "string" },
          role: { type: "string" },
        },
        required: [primaryKey],
      },
    },
    {
      name: "list_audit_events",
      description: `List ${id} simulator audit events.`,
      inputSchema: { type: "object", properties: { limit: { type: "integer" } } },
    },
  ];
  if (collections.includes("approvals")) {
    tools.splice(2, 0, {
      name: "list_pending_approvals",
      description: `List pending ${id} approvals.`,
      inputSchema: { type: "object", properties: { source_record_id: { type: "string" } } },
    });
  }
  return { id: `${id}_tools`, version: 1, tools };
}

function workflowsFor(id, archetype) {
  const collections = Object.keys(archetype.collections);
  const primary = collections[0];
  const primaryFields = archetype.collections[primary];
  const primaryKey = primaryFields[0];
  const singular = singularOf(primary);
  const stateField = lifecycleField(primaryFields);
  const handler = {
    primitive: "state_machine_update",
    collection: primary,
    primaryKey,
    roleArg: "role",
    allowedRoles: archetype.roles,
    stateField,
    targetStateArg: stateField,
    noteArg: "note",
    transitions: {
      "*": ["active", "pending_approval", "inactive", "cancelled", "closed", "approved", "rejected"],
      active: ["pending_approval", "inactive", "cancelled", "closed"],
      pending_approval: ["active", "approved", "rejected", "cancelled"],
      approved: ["closed", "inactive"],
    },
  };
  if (collections.includes("approvals")) {
    handler.approvalBlockers = [
      {
        collection: "approvals",
        sourceRecordField: "source_record_id",
        states: ["requested", "pending", "pending_approval"],
        blockedTargetStates: ["closed", "inactive", "cancelled"],
      },
    ];
  }
  return {
    id: `${id}_workflows`,
    version: 1,
    primitives: [
      "role_permission_gate",
      "state_machine",
      "approval_blocker",
      "audit_trail",
    ],
    toolHandlers: {
      [`submit_${singular}_update`]: handler,
    },
  };
}

function projectionFor(id, archetype) {
  return {
    id: `${id}_projection`,
    version: 1,
    materialization: `Project scenario graph concepts into ${id} collections; Snowfakery realizes large row sets from the same graph.`,
    collectionMappings: archetype.projection.map(([graphKind, realizedObjects, collection]) => ({
      graphKinds: [graphKind],
      realizedObjects,
      simulatorCollection: collection,
      mergeMode: "merge-records-by-primary-key",
    })),
  };
}

function materializationFor(id, archetype) {
  return {
    id: `${id}_materialization`,
    version: 1,
    collections: Object.fromEntries(Object.entries(archetype.collections).map(([collection, fields]) => [
      collection,
      {
        primaryKey: fields[0],
        fieldAliases: Object.fromEntries(fields.map((field) => [field, [field, "id", "source_record_id"].filter((item, idx, arr) => arr.indexOf(item) === idx)])),
        defaults: lifecycleDefaults(fields),
      },
    ])),
  };
}

function seedFor(archetype) {
  return Object.fromEntries(Object.entries(archetype.collections).map(([collection, fields]) => [
    collection,
    collection === "audit_events" ? [] : [
      Object.fromEntries(fields.map((field) => [field, sampleValueFor(field, collection)])),
    ],
  ]));
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  if (flags.listArchetypes === "true" || flags["list-archetypes"] === "true") {
    console.log(JSON.stringify({
      ok: true,
      archetypes: Object.entries(ARCHETYPES).map(([id, archetype]) => ({
        id,
        family: archetype.family,
        entities: archetype.entities,
        workflows: archetype.workflows,
        roles: archetype.roles,
        primaryCollection: Object.keys(archetype.collections)[0],
        collections: Object.keys(archetype.collections),
      })),
    }, null, 2));
    return;
  }
  const id = snakeCase(flags.id || flags.system);
  if (!id) throw new Error("--id required");
  const displayName = flags.displayName || flags.name || id.replace(/_/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());
  const archetypeId = flags.archetype || flags.family || "procurement";
  const archetype = ARCHETYPES[archetypeId];
  if (!archetype) throw new Error(`unknown archetype ${archetypeId}; choose ${Object.keys(ARCHETYPES).join(", ")}`);
  const root = resolve(flags.root || ".");
  const packDir = join(root, "apps", "factory", "simulator-systems", id);
  if (existsSync(packDir) && flags.force !== "true") throw new Error(`${packDir} exists; pass --force true to overwrite pack files`);

  const schema = schemaFor(id, archetype);
  const tools = toolsFor(id, archetype);
  const projection = projectionFor(id, archetype);
  const materialization = materializationFor(id, archetype);
  const workflows = workflowsFor(id, archetype);
  const seed = seedFor(archetype);

  await writeJson(join(packDir, "schema.json"), schema);
  await writeJson(join(packDir, "tools.json"), tools);
  await writeJson(join(packDir, "projection.json"), projection);
  await writeJson(join(packDir, "materialization.json"), materialization);
  await writeJson(join(packDir, "workflows.json"), workflows);
  await writeJson(join(packDir, "seed.json"), seed);

  const registryPath = join(root, REGISTRY_PATH);
  const registry = await readJson(registryPath, { version: 1, simulators: [] });
  const entry = {
    id,
    displayName,
    aliases: [displayName, id],
    maturity: flags.realism || "starter",
    family: archetype.family,
    entities: archetype.entities,
    workflows: archetype.workflows,
    roles: archetype.roles,
    tools: tools.tools.map((tool) => tool.name),
    schemaPath: `apps/factory/simulator-systems/${id}/schema.json`,
    toolsPath: `apps/factory/simulator-systems/${id}/tools.json`,
    projectionPath: `apps/factory/simulator-systems/${id}/projection.json`,
    materializationPath: `apps/factory/simulator-systems/${id}/materialization.json`,
    workflowsPath: `apps/factory/simulator-systems/${id}/workflows.json`,
    seedPath: `apps/factory/simulator-systems/${id}/seed.json`,
    plugin: {
      runtime: "python",
      module: "simulator_runtime.generic",
      handlerMap: null,
    },
    schemaExtension: {
      mode: "merge-records-by-primary-key",
      collections: Object.fromEntries(Object.entries(schema.collections).map(([collection, spec]) => [collection, spec.primaryKey])),
    },
    backingStores: ["alloydb", "bigquery"],
    failureModes: ["permission_denied", "validation_error", "pending_approval"],
    evalScenarios: [],
    sourceIntegration: {
      strategy: "simulator-backed-mcp",
      runtime: "cloud-run-mcp-service",
    },
  };
  registry.simulators = [...(registry.simulators || []).filter((simulator) => simulator.id !== id), entry];
  await writeJson(registryPath, registry);

  console.log(JSON.stringify({
    ok: true,
    id,
    archetype: archetypeId,
    packDir,
    registry: REGISTRY_PATH,
    next: [
      `npm run generator:validate-simulators -- --system ${id}`,
      "Use generic handlers immediately; add custom runtime handlers only for system-specific workflow semantics.",
      "npm run generator:test-simulators",
      "npm run generator:simulator-coverage",
    ],
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
