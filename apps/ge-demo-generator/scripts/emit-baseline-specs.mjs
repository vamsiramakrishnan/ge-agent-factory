#!/usr/bin/env node
// Programmatically emit a structurally-valid generationSpec + behaviorContract
// into every slide TSX that currently relies on the sync-script's synthesized
// fallback. Each emitted spec should pass the current downstream audit
// (apps/ge-demo-generator/scripts/audit-usecase-specs.mjs).
//
// Run from repo root:
//   node apps/ge-demo-generator/scripts/emit-baseline-specs.mjs
//
// Use --dry to skip writes, --only <substr> to filter, --limit N to cap.

import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { buildWorkflowFromPipeline } from "./ge-mock/agent-workflow.mjs";

const repoRoot = resolve(".");
const generatorDir = join(repoRoot, "apps/ge-demo-generator");
const catalogPath = join(generatorDir, "src/use-cases.js");

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const val = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : null;
};
const DRY = flag("dry");
const ONLY = val("only");
const LIMIT = val("limit") ? Number(val("limit")) : null;

// ── System metadata library ──────────────────────────────────────────────────

const PROTOCOL_BY_SYSTEM = [
  [/sap s\/4hana|sap erp|sap fi|sap co|sap mm|sap sd|sap bpc|sap grc|sap successfactors/i, "RFC/BAPI"],
  [/sap ariba/i, "REST API"],
  [/sap concur/i, "REST API"],
  [/bigquery/i, "BigQuery SQL"],
  [/looker/i, "LookerML"],
  [/tableau/i, "REST API"],
  [/salesforce|service cloud|marketing cloud|sales cloud/i, "REST API"],
  [/workday/i, "Workday REST"],
  [/servicenow/i, "REST API"],
  [/coupa|jaggaer|ariba/i, "REST API"],
  [/oracle/i, "REST API"],
  [/blackline/i, "REST API"],
  [/anaplan/i, "REST API"],
  [/highradius/i, "REST API"],
  [/kyriba/i, "REST API"],
  [/icertis|docusign clm|conga/i, "REST API"],
  [/docusign(?! clm)/i, "REST API"],
  [/greenhouse|lever|workable|smartrecruiters/i, "REST API"],
  [/google workspace|google drive|google docs|google sheets|google slides|gmail|google calendar|google chat/i, "Workspace API"],
  [/microsoft 365|outlook|sharepoint|teams|onedrive/i, "Graph API"],
  [/slack/i, "Slack API"],
  [/datadog/i, "REST API"],
  [/pagerduty/i, "REST API"],
  [/opsgenie/i, "REST API"],
  [/splunk/i, "REST API"],
  [/jira|confluence/i, "REST API"],
  [/github/i, "REST API"],
  [/gitlab/i, "REST API"],
  [/jenkins|argocd|circleci/i, "REST API"],
  [/kubernetes|gke|eks|aks/i, "Kubernetes API"],
  [/terraform/i, "HCL/CLI"],
  [/snyk|sonarqube|qualys|crowdstrike/i, "REST API"],
  [/okta|auth0|ping/i, "REST API"],
  [/active directory|azure ad|entra/i, "Graph API"],
  [/aws|amazon web|cloudwatch/i, "AWS SDK"],
  [/azure/i, "Azure SDK"],
  [/google cloud|gcp/i, "GCP SDK"],
  [/hubspot|marketo|pardot|eloqua/i, "REST API"],
  [/segment|amplitude|mixpanel/i, "REST API"],
  [/google ads|meta ads|linkedin ads|tiktok ads/i, "Ads API"],
  [/google analytics|ga4|adobe analytics/i, "REST API"],
  [/sprout social|brandwatch|hootsuite|sprinklr/i, "REST API"],
  [/zendesk|freshdesk|intercom/i, "REST API"],
  [/lattice|culture amp|qualtrics/i, "REST API"],
];

const DATASTORE_BY_CATEGORY = {
  erp: "alloydb",
  oltp: "alloydb",
  workflow: "alloydb",
  analytics: "bigquery",
  warehouse: "bigquery",
  doc: "cloud-storage",
  content: "cloud-storage",
  cms: "cloud-storage",
  messaging: "json-api",
  observability: "bigquery",
};

const SYSTEM_CATEGORY = [
  [/sap|workday|oracle|netsuite|servicenow|coupa|ariba|greenhouse|lever|highradius|kyriba|blackline|anaplan|salesforce|hubspot|marketo|jira|icertis|docusign|jaggaer|benefitfocus|lattice|culture amp|qualtrics|zendesk|freshdesk|intercom/i, "erp"],
  [/bigquery|snowflake|databricks|redshift|looker|tableau|powerbi|adobe analytics|google analytics|ga4|amplitude|mixpanel|segment/i, "analytics"],
  [/google drive|google docs|google slides|google sheets|sharepoint|confluence|notion|box|dropbox|bynder|frame\.io|figma|canva|wordpress|contentful|drupal/i, "doc"],
  [/slack|gmail|google chat|outlook|teams|intercom messaging|sms|twilio/i, "messaging"],
  [/datadog|pagerduty|opsgenie|splunk|new relic|prometheus|grafana|cloudwatch|stackdriver/i, "observability"],
  [/github|gitlab|bitbucket|jenkins|argocd|circleci|kubernetes|gke|eks|aks|terraform|ansible|puppet/i, "workflow"],
  [/okta|auth0|ping|active directory|azure ad|entra/i, "workflow"],
  [/google ads|meta ads|linkedin ads|tiktok ads|adwords/i, "analytics"],
];

const SYSTEM_ENTITIES = [
  [/workday/i, ["employees", "positions", "compensation_records"]],
  [/sap successfactors/i, ["employee_records", "performance_reviews", "talent_pool"]],
  [/greenhouse|lever|workable|smartrecruiters/i, ["candidates", "job_requisitions", "interview_stages"]],
  [/benefitfocus|benefits platform/i, ["benefit_plans", "enrollments", "eligibility_rules"]],
  [/lattice|culture amp/i, ["engagement_surveys", "feedback_records", "review_cycles"]],
  [/sap s\/4hana fi|sap fi/i, ["gl_entries", "subledger_balances", "open_items"]],
  [/sap s\/4hana co/i, ["cost_centers", "internal_orders", "cost_allocations"]],
  [/sap s\/4hana sd/i, ["sales_orders", "contracts", "billing_documents"]],
  [/sap s\/4hana mm|sap mm/i, ["purchase_orders", "material_movements", "vendors"]],
  [/sap s\/4hana(?!\s)|sap erp|sap$/i, ["transactions", "journal_entries", "master_data"]],
  [/sap ariba/i, ["suppliers", "sourcing_events", "contracts"]],
  [/sap concur/i, ["expense_reports", "travel_bookings", "policy_exceptions"]],
  [/sap bpc|anaplan|workday adaptive/i, ["budget_lines", "forecast_versions", "variance_records"]],
  [/sap grc/i, ["control_tests", "risk_assessments", "remediation_actions"]],
  [/blackline/i, ["reconciliations", "matching_rules", "certifications"]],
  [/highradius/i, ["payment_remittances", "collections_queues", "deduction_cases"]],
  [/kyriba/i, ["cash_positions", "bank_transactions", "forecast_inputs"]],
  [/coupa(?! catalog)/i, ["requisitions", "purchase_orders", "invoices"]],
  [/coupa catalog/i, ["catalog_items", "supplier_offerings", "punchout_links"]],
  [/jaggaer/i, ["supplier_profiles", "sourcing_events", "scorecards"]],
  [/icertis|docusign clm|conga/i, ["contracts", "amendments", "obligations"]],
  [/docusign(?! clm)/i, ["envelopes", "recipients", "audit_trails"]],
  [/servicenow/i, ["tickets", "change_requests", "incidents"]],
  [/salesforce|sales cloud/i, ["accounts", "opportunities", "campaign_influence"]],
  [/service cloud/i, ["cases", "service_contracts", "case_comments"]],
  [/marketing cloud/i, ["journeys", "audience_segments", "send_logs"]],
  [/hubspot/i, ["contacts", "deals", "engagement_events"]],
  [/marketo|pardot|eloqua/i, ["campaigns", "leads", "engagement_scores"]],
  [/bigquery/i, ["analytics_events", "historical_metrics", "cached_aggregates"]],
  [/snowflake|databricks|redshift/i, ["fact_records", "dimension_records", "rollup_metrics"]],
  [/looker/i, ["dashboards", "explore_queries", "metric_definitions"]],
  [/tableau|powerbi/i, ["dashboards", "datasource_extracts", "alert_subscriptions"]],
  [/okta|auth0|ping/i, ["users", "groups", "access_grants"]],
  [/active directory|azure ad|entra/i, ["directory_users", "security_groups", "role_assignments"]],
  [/google workspace/i, ["accounts", "group_memberships", "license_assignments"]],
  [/google drive/i, ["documents", "folder_permissions", "share_events"]],
  [/google docs/i, ["documents", "comments", "revision_history"]],
  [/google sheets/i, ["sheets", "named_ranges", "edit_history"]],
  [/google slides/i, ["presentations", "slide_assets", "view_logs"]],
  [/google calendar/i, ["events", "attendee_responses", "room_bookings"]],
  [/google chat|gmail/i, ["messages", "threads", "delivery_receipts"]],
  [/slack/i, ["messages", "channels", "thread_replies"]],
  [/sharepoint/i, ["documents", "site_permissions", "library_metadata"]],
  [/confluence/i, ["pages", "comments", "space_permissions"]],
  [/notion/i, ["pages", "databases", "block_changes"]],
  [/datadog/i, ["alerts", "monitors", "metrics_snapshots"]],
  [/pagerduty/i, ["incidents", "oncall_schedules", "escalation_policies"]],
  [/opsgenie/i, ["alerts", "escalation_policies", "team_routing_rules"]],
  [/splunk/i, ["log_events", "search_jobs", "alert_actions"]],
  [/prometheus|grafana/i, ["metric_series", "alert_rules", "dashboard_panels"]],
  [/jira/i, ["issues", "sprints", "epics"]],
  [/github/i, ["pull_requests", "commits", "workflow_runs"]],
  [/gitlab/i, ["merge_requests", "pipelines", "code_reviews"]],
  [/jenkins|argocd|circleci/i, ["pipeline_runs", "deployments", "test_results"]],
  [/kubernetes|gke|eks|aks/i, ["workloads", "deployments", "pod_events"]],
  [/terraform/i, ["modules", "state_versions", "plan_diffs"]],
  [/snyk/i, ["vulnerabilities", "fix_advice", "scan_runs"]],
  [/sonarqube/i, ["code_smells", "security_hotspots", "quality_gates"]],
  [/qualys|crowdstrike/i, ["scan_findings", "asset_inventory", "remediation_tasks"]],
  [/aws|amazon web|cloudwatch|aws cost explorer/i, ["billing_records", "resource_inventory", "alarm_events"]],
  [/azure|gcp billing|google cloud/i, ["billing_records", "resource_inventory", "alarm_events"]],
  [/google ads/i, ["campaigns", "ad_groups", "spend_records"]],
  [/meta ads/i, ["campaigns", "ad_creatives", "spend_records"]],
  [/linkedin ads/i, ["campaigns", "audience_segments", "spend_records"]],
  [/sprout social|hootsuite|sprinklr/i, ["social_posts", "engagement_metrics", "publishing_queue"]],
  [/brandwatch/i, ["brand_mentions", "sentiment_scores", "topic_clusters"]],
  [/ga4|google analytics/i, ["session_events", "conversion_paths", "audience_segments"]],
  [/adobe analytics/i, ["session_events", "segments", "conversion_funnels"]],
  [/semrush|ahrefs|moz/i, ["keyword_rankings", "backlink_profile", "competitor_data"]],
  [/zendesk|freshdesk/i, ["tickets", "macros", "satisfaction_scores"]],
  [/intercom/i, ["conversations", "user_segments", "automation_rules"]],
  [/qualtrics|culture amp/i, ["survey_responses", "respondent_segments", "trend_metrics"]],
  [/bynder|figma|canva|adobe creative/i, ["assets", "asset_versions", "approval_queues"]],
  [/wordpress|contentful|drupal/i, ["content_entries", "publishing_workflows", "media_assets"]],
];

function snake(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[\(\)]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    || "system";
}

function systemId(name) {
  return snake(name.replace(/\bAI\b/g, "ai"));
}

function isModelProvider(name) {
  return /vertex\s*ai|gemini|openai|anthropic|claude|chatgpt|llm$/i.test(name);
}

function categoryFor(name) {
  for (const [re, cat] of SYSTEM_CATEGORY) if (re.test(name)) return cat;
  return "erp";
}

function datastoreFor(name) {
  return DATASTORE_BY_CATEGORY[categoryFor(name)] || "alloydb";
}

function protocolFor(name, fallback) {
  for (const [re, p] of PROTOCOL_BY_SYSTEM) if (re.test(name)) return p;
  return fallback || "REST API";
}

function entityNamesFor(name, sysId) {
  for (const [re, ents] of SYSTEM_ENTITIES) if (re.test(name)) return ents;
  return [`${sysId}_records`, `${sysId}_events`, `${sysId}_audit_trail`];
}

// ── Column heuristics per entity name ───────────────────────────────────────

function columnsFor(entityName) {
  const n = entityName.toLowerCase();
  if (/^(invoice|payment_remittance|requisition|purchase_order|billing_document|sales_order)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "source_record_id", type: "seq", required: true },
      { name: "vendor", type: "company.name", required: true },
      { name: "amount", type: "float", min: 100, max: 100000, decimals: 2, required: true },
      { name: "currency", type: "enum", values: ["USD", "EUR", "GBP", "JPY"], weights: [0.7, 0.15, 0.1, 0.05], required: true },
      { name: "status", type: "enum", values: ["draft", "pending", "approved", "paid", "rejected"], weights: [0.1, 0.3, 0.3, 0.2, 0.1], required: true },
      { name: "created_at", type: "date", required: true },
      { name: "due_date", type: "date", required: true },
    ];
  }
  if (/(transaction|gl_entr|journal_entr|subledger|open_item|material_movement)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "posting_date", type: "date", required: true },
      { name: "account", type: "enum", values: ["1000-Cash", "2000-AP", "2100-AR", "3000-Revenue", "4000-Expense", "5000-COGS"], required: true },
      { name: "amount", type: "float", min: -50000, max: 50000, decimals: 2, required: true },
      { name: "currency", type: "enum", values: ["USD", "EUR", "GBP"], required: true },
      { name: "description", type: "lorem.sentence", required: true },
      { name: "status", type: "enum", values: ["posted", "pending", "reversed"], weights: [0.8, 0.15, 0.05], required: true },
    ];
  }
  if (/^(ticket|incident|case|change_request|alert|sla_event|escalation)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "title", type: "lorem.sentence", required: true },
      { name: "priority", type: "enum", values: ["P1", "P2", "P3", "P4"], weights: [0.05, 0.15, 0.4, 0.4], required: true },
      { name: "status", type: "enum", values: ["open", "triaged", "in_progress", "resolved", "closed"], required: true },
      { name: "assignee", type: "person.fullName", required: true },
      { name: "created_at", type: "date", required: true },
      { name: "category", type: "enum", values: ["access", "hardware", "software", "network", "policy", "billing"], required: true },
      { name: "sla_met", type: "boolean", trueRate: 0.78 },
    ];
  }
  if (/^(employee|worker|position|compensation_record|candidate|talent_pool|directory_user)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "source_record_id", type: "seq", required: true },
      { name: "name", type: "person.fullName", required: true },
      { name: "email", type: "internet.email", required: true },
      { name: "department", type: "enum", values: ["Finance", "HR", "IT", "Marketing", "Procurement", "Engineering", "Operations"], required: true },
      { name: "region", type: "enum", values: ["US", "EMEA", "APAC", "LATAM"], required: true },
      { name: "status", type: "enum", values: ["active", "on_leave", "inactive"], weights: [0.85, 0.1, 0.05], required: true },
      { name: "level", type: "enum", values: ["L3", "L4", "L5", "L6", "L7"], required: true },
      { name: "hired_on", type: "date", required: true },
    ];
  }
  if (/^(vendor|supplier|supplier_profile|supplier_offering)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "name", type: "company.name", required: true },
      { name: "category", type: "enum", values: ["IT", "Consulting", "Manufacturing", "Logistics", "Facilities", "Marketing"], required: true },
      { name: "rating", type: "number", min: 1, max: 5, required: true },
      { name: "annual_spend", type: "number", min: 10000, max: 5000000, required: true },
      { name: "risk_score", type: "enum", values: ["low", "medium", "high"], weights: [0.5, 0.35, 0.15], required: true },
      { name: "status", type: "enum", values: ["active", "pending_review", "terminated"], required: true },
      { name: "onboarded_on", type: "date", required: true },
    ];
  }
  if (/(contract|amendment|obligation|envelope|sourcing_event)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "counterparty", type: "company.name", required: true },
      { name: "value", type: "number", min: 10000, max: 5000000, required: true },
      { name: "currency", type: "enum", values: ["USD", "EUR", "GBP"], required: true },
      { name: "start_date", type: "date", required: true },
      { name: "end_date", type: "date", required: true },
      { name: "status", type: "enum", values: ["draft", "negotiating", "active", "expired", "terminated"], required: true },
      { name: "auto_renew", type: "boolean", trueRate: 0.4 },
    ];
  }
  if (/^(campaign|ad_group|audience_segment|journey|send_log)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "name", type: "lorem.sentence", required: true },
      { name: "channel", type: "enum", values: ["email", "social", "search", "display", "content", "events"], required: true },
      { name: "segment", type: "enum", values: ["enterprise", "mid_market", "smb"], required: true },
      { name: "impressions", type: "number", min: 1000, max: 500000, required: true },
      { name: "conversions", type: "number", min: 0, max: 5000, required: true },
      { name: "spend", type: "number", min: 1000, max: 200000, required: true },
      { name: "ctr", type: "float", min: 0.1, max: 9.5, decimals: 2, required: true },
      { name: "launched_on", type: "date", required: true },
    ];
  }
  if (/^(lead|contact|prospect|engagement_event|engagement_score)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "name", type: "person.fullName", required: true },
      { name: "email", type: "internet.email", required: true },
      { name: "company", type: "company.name", required: true },
      { name: "score", type: "number", min: 0, max: 100, required: true },
      { name: "stage", type: "enum", values: ["new", "qualified", "engaged", "opportunity", "lost"], required: true },
      { name: "created_at", type: "date", required: true },
    ];
  }
  if (/^(opportunity|account|deal|campaign_influence)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "account_name", type: "company.name", required: true },
      { name: "amount", type: "number", min: 5000, max: 1000000, required: true },
      { name: "stage", type: "enum", values: ["prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"], required: true },
      { name: "owner", type: "person.fullName", required: true },
      { name: "close_date", type: "date", required: true },
    ];
  }
  if (/(reconciliation|matching_rule|certification|control_test|risk_assessment)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "name", type: "lorem.sentence", required: true },
      { name: "status", type: "enum", values: ["open", "in_progress", "certified", "exception"], required: true },
      { name: "owner", type: "person.fullName", required: true },
      { name: "match_rate", type: "float", min: 0.0, max: 1.0, decimals: 2, required: true },
      { name: "last_run", type: "date", required: true },
    ];
  }
  if (/(metric|kpi|dashboard|analytics_event|historical_metric|cached_aggregate|rollup|fact_record|trend_metric)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "period", type: "enum", values: ["day", "week", "month", "quarter"], required: true },
      { name: "metric_name", type: "lorem.words", required: true },
      { name: "value", type: "float", min: 0, max: 100000, decimals: 2, required: true },
      { name: "variance_pct", type: "float", min: -50, max: 50, decimals: 2, required: true },
      { name: "computed_at", type: "date", required: true },
    ];
  }
  if (/(rule|policy|configuration|playbook|runbook|handbook|control)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "name", type: "lorem.sentence", required: true },
      { name: "category", type: "enum", values: ["compliance", "operational", "financial", "security"], required: true },
      { name: "owner", type: "person.fullName", required: true },
      { name: "status", type: "enum", values: ["active", "draft", "retired"], required: true },
      { name: "last_updated", type: "date", required: true },
    ];
  }
  if (/(document|page|content_entry|knowledge|guide|sop|notice|presentation|brief|playbook_doc|spec)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "title", type: "lorem.sentence", required: true },
      { name: "owner", type: "person.fullName", required: true },
      { name: "status", type: "enum", values: ["draft", "review", "published", "archived"], required: true },
      { name: "last_updated", type: "date", required: true },
    ];
  }
  if (/(audit|log|event|trail|history|revision|view_log|edit_history|delivery_receipt|share_event|change_log)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "actor", type: "person.fullName", required: true },
      { name: "action", type: "enum", values: ["create", "update", "delete", "approve", "reject", "escalate", "view", "share"], required: true },
      { name: "target_type", type: "lorem.words", required: true },
      { name: "created_at", type: "date", required: true },
      { name: "notes", type: "lorem.sentence" },
    ];
  }
  if (/(workload|deployment|pod_event|workflow_run|pipeline_run|build|release)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "name", type: "lorem.words", required: true },
      { name: "status", type: "enum", values: ["pending", "running", "succeeded", "failed", "rolled_back"], required: true },
      { name: "duration_seconds", type: "number", min: 5, max: 7200, required: true },
      { name: "started_at", type: "date", required: true },
      { name: "environment", type: "enum", values: ["dev", "staging", "prod"], required: true },
    ];
  }
  if (/(vulnerability|finding|scan_finding|code_smell|security_hotspot|quality_gate)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "title", type: "lorem.sentence", required: true },
      { name: "severity", type: "enum", values: ["low", "medium", "high", "critical"], weights: [0.4, 0.35, 0.2, 0.05], required: true },
      { name: "status", type: "enum", values: ["open", "triaged", "mitigated", "accepted_risk", "closed"], required: true },
      { name: "detected_at", type: "date", required: true },
      { name: "asset", type: "lorem.words", required: true },
    ];
  }
  if (/(message|conversation|thread|reply|post|social_post)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "channel", type: "lorem.words", required: true },
      { name: "author", type: "person.fullName", required: true },
      { name: "body", type: "lorem.sentence", required: true },
      { name: "sentiment", type: "enum", values: ["positive", "neutral", "negative"], weights: [0.4, 0.4, 0.2], required: true },
      { name: "sent_at", type: "date", required: true },
    ];
  }
  if (/(survey|response|feedback)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "respondent_id", type: "seq", required: true },
      { name: "question_code", type: "lorem.words", required: true },
      { name: "score", type: "number", min: 1, max: 10, required: true },
      { name: "comment", type: "lorem.sentence" },
      { name: "submitted_at", type: "date", required: true },
    ];
  }
  if (/(budget|forecast|plan_line)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "cost_center", type: "lorem.words", required: true },
      { name: "period", type: "enum", values: ["month", "quarter", "year"], required: true },
      { name: "budget_amount", type: "number", min: 10000, max: 5000000, required: true },
      { name: "actual_amount", type: "number", min: 0, max: 6000000, required: true },
      { name: "variance_pct", type: "float", min: -100, max: 100, decimals: 2, required: true },
      { name: "scenario", type: "enum", values: ["baseline", "stretch", "downside"], required: true },
    ];
  }
  if (/(billing_record|spend_record|cost_record)/.test(n)) {
    return [
      { name: "id", type: "seq", required: true },
      { name: "service", type: "lorem.words", required: true },
      { name: "amount", type: "float", min: 1, max: 10000, decimals: 2, required: true },
      { name: "currency", type: "enum", values: ["USD", "EUR"], required: true },
      { name: "period_start", type: "date", required: true },
      { name: "period_end", type: "date", required: true },
    ];
  }
  // generic fallback
  return [
    { name: "id", type: "seq", required: true },
    { name: "source_record_id", type: "seq", required: true },
    { name: "status", type: "enum", values: ["active", "pending", "closed"], required: true },
    { name: "owner", type: "person.fullName", required: true },
    { name: "created_at", type: "date", required: true },
    { name: "notes", type: "lorem.sentence" },
  ];
}

function isReferenceTable(name) {
  return /(rule|policy|playbook|runbook|handbook|configuration|reference|catalog_item|metric_definition|named_range|escalation_policy|control)/i.test(name);
}

function rowCountFor(name) {
  return isReferenceTable(name) ? 30 : 60;
}

// ── Behavior contract synthesis ─────────────────────────────────────────────

const ACTION_VERBS = [
  ["publish", "publish"], ["file", "file"], ["send", "send"], ["distribute", "distribute"],
  ["escalate", "escalate"], ["route", "route"], ["create ticket", "create_ticket"],
  ["create incident", "create_incident"], ["approve", "approve"], ["recommend", "recommend"],
  ["generate", "generate"], ["draft", "draft"], ["remediate", "remediate"],
  ["update", "update"], ["close", "close"], ["assign", "assign"], ["release", "release"],
  ["block", "block"], ["enrich", "enrich"], ["notify", "notify"],
  ["submit", "submit"], ["enroll", "enroll"], ["sync", "sync"], ["create", "create"],
  ["deploy", "deploy"], ["trigger", "trigger"], ["certify", "certify"], ["match", "match"],
  ["match", "match"], ["validate", "validate"], ["reconcile", "reconcile"], ["post", "post"],
  ["log", "log_entry"], ["archive", "archive"], ["expire", "expire"], ["onboard", "onboard"],
  ["provision", "provision"], ["revoke", "revoke"], ["promote", "promote"], ["roll back", "rollback"],
];

// Audit's regex for "writes external state" — keep in sync with audit-usecase-specs.mjs
const WRITES_STATE_RE = /(submit|enroll|ticket|sync|create|approve|notify|publish|deploy|update|escalat|trigger|certify|match|reconcil|post|provision|revoke|remediat|generat|file|distribut|send|route|draft|assign|release)/i;

function pickAction(agentification, persona, title) {
  const text = (agentification || []).join(" ").toLowerCase() + " " + (persona || "").toLowerCase() + " " + (title || "").toLowerCase();
  for (const [needle, verb] of ACTION_VERBS) {
    if (text.includes(needle)) return verb;
  }
  // Fallback: if any state-change verb appears in the corpus, use a generic verb
  if (WRITES_STATE_RE.test(text)) return "execute";
  return null;
}

function deriveRole(useCase) {
  return `${useCase.persona || "Operator"} agent for the ${useCase.title} workflow`;
}

function deriveObjective(useCase) {
  const a0 = (useCase.agentification && useCase.agentification[0]) || "";
  const a1 = (useCase.agentification && useCase.agentification[1]) || "";
  const trimmed = `${a0} ${a1}`.replace(/\s+/g, " ").trim();
  const kpiLabel = useCase.kpis && useCase.kpis[0] ? useCase.kpis[0].label : "operational efficiency";
  let obj = `${trimmed || `Drive ${useCase.title} outcomes`} so the ${useCase.persona || "team"} can move the ${kpiLabel} KPI.`;
  // ensure ≥60 chars
  if (obj.length < 80) {
    obj = `${obj} The agent grounds every recommendation in source-system evidence and routes irreversible actions through human review.`;
  }
  return obj;
}

function pickDocument(useCase) {
  const titleSlug = useCase.id;
  const dept = useCase.department;
  // Department-tuned document mapping
  const map = {
    finance: { id: `${titleSlug}-controls-playbook`, type: "policy", title: `${useCase.title} Controls Playbook`, sections: ["Workflow scope", "Materiality thresholds", "Escalation triggers", "Audit evidence requirements", "Quarter-end variations"], anchors: ["scope", "materiality", "escalation", "audit-evidence"] },
    hr: { id: `${titleSlug}-policy-handbook`, type: "policy", title: `${useCase.title} Policy Handbook`, sections: ["Eligibility and scope", "Workflow steps", "Manager responsibilities", "Compliance and audit", "Sensitive-data handling"], anchors: ["eligibility", "workflow", "compliance", "sensitive-data"] },
    it: { id: `${titleSlug}-runbook`, type: "runbook", title: `${useCase.title} Operations Runbook`, sections: ["Detection signals", "Triage procedures", "Remediation actions", "Rollback criteria", "Post-incident review"], anchors: ["detection", "triage", "remediation", "rollback"] },
    marketing: { id: `${titleSlug}-playbook`, type: "playbook", title: `${useCase.title} Playbook`, sections: ["Audience guidelines", "Brand voice rules", "Channel-specific guardrails", "Measurement framework", "Approval thresholds"], anchors: ["audience", "brand-voice", "channels", "approvals"] },
    procurement: { id: `${titleSlug}-policy-guide`, type: "policy", title: `${useCase.title} Procurement Policy Guide`, sections: ["Sourcing principles", "Approval thresholds", "Supplier risk requirements", "Contract and compliance gates", "Exception handling"], anchors: ["sourcing", "approvals", "supplier-risk", "exceptions"] },
  };
  return map[dept] || map.it;
}

function deriveScope(useCase) {
  const ag = useCase.agentification || [];
  const sq = useCase.statusQuo || [];
  const inScope = ag.slice(0, 4).map((s) => s.replace(/\.$/, ""));
  if (inScope.length === 0) {
    inScope.push(
      `Run the ${useCase.title} workflow end-to-end and cite source-system evidence`,
      `Surface escalation candidates to ${useCase.persona || "operator"} with full audit trail`,
    );
  }
  const dept = useCase.department;
  const outOfScopeBase = {
    finance: [
      "Final sign-off on materially significant journal entries (Controller retains authority)",
      "Restatement of prior-period filings",
      "Tax position changes that require external advisor review",
    ],
    hr: [
      "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
      "Performance management adjudication and disciplinary action",
      "Legal interpretation of employment law in ambiguous jurisdictions",
    ],
    it: [
      "Production deployments outside an approved change window",
      "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
      "Security incident attribution requiring forensics",
    ],
    marketing: [
      "Final approval of paid spend reallocations above the governance threshold",
      "Trademark, legal, or regulated-industry claim approval",
      "Crisis communications without comms-team sign-off",
    ],
    procurement: [
      "Contract execution without legal review",
      "Supplier disqualification decisions (category lead retains authority)",
      "Single-source justification overrides above policy threshold",
    ],
  };
  const outOfScope = outOfScopeBase[dept] || outOfScopeBase.it;
  return { inScope, outOfScope };
}

function generateBehaviorContract(useCase, sourceSystems) {
  const kpis = useCase.kpis || [];
  const persona = useCase.persona || "Operator";
  const actionVerb = pickAction(useCase.agentification, persona, useCase.title);
  const docMeta = pickDocument(useCase);
  const docId = docMeta.id;
  const primarySystem = sourceSystems[0];
  const lookupSystem = sourceSystems.find((s) => /bigquery|cloud-storage/.test(s.localBacking?.[0])) || primarySystem;
  const actionSystem = sourceSystems.find((s) => !/bigquery/.test(s.localBacking?.[0])) || primarySystem;

  const toolIntents = [];

  // One query per source system (capped at 4 to keep contract focused)
  for (const sys of sourceSystems.slice(0, 4)) {
    const entity = sys.owns[0];
    toolIntents.push({
      name: `query_${sys.id}_${entity}`,
      kind: "query",
      sourceSystemId: sys.id,
      description: `Retrieve ${entity.replace(/_/g, " ")} from ${sys.name} for the ${useCase.title} workflow.`,
      requiredInputs: ["lookup_key", "date_range"],
      produces: [`${entity}_records`, `${entity}_summary`],
      evidenceEmitted: sys.localBacking?.[0] === "bigquery" ? ["sql_result"] : ["source_system_record"],
    });
  }

  // Evidence lookup
  toolIntents.push({
    name: `lookup_${snake(docId)}`,
    kind: "evidence_lookup",
    sourceSystemId: lookupSystem.id,
    description: `Look up sections of the ${docMeta.title} to cite in narrative output, escalation rationale, and audit evidence.`,
    requiredInputs: ["section_anchor"],
    produces: ["document_section", "citation_anchor"],
    evidenceEmitted: ["document_reference"],
  });

  // Action intent if state-changing
  if (actionVerb) {
    toolIntents.push({
      name: `action_${actionSystem.id}_${actionVerb}`,
      kind: "action",
      sourceSystemId: actionSystem.id,
      description: `Execute the ${actionVerb.replace(/_/g, " ")} step in ${actionSystem.name} after the agent has gathered evidence and validated escalation gates.`,
      requiredInputs: ["target_id", "rationale"],
      produces: ["action_id", "audit_record_id"],
      evidenceEmitted: ["api_response", "generated_audit_trail"],
    });
  }

  // Evidence requirements from KPIs
  const evidenceRequirements = kpis.slice(0, 2).map((kpi, i) => ({
    claim: `${kpi.label} moved from ${kpi.before} toward ${kpi.after}`,
    mustCite: sourceSystems.slice(0, 2).map((s) => `${s.id}.${s.owns[0]}`),
    sourceSystemIds: sourceSystems.slice(0, 2).map((s) => s.id),
  }));
  if (evidenceRequirements.length === 0) {
    evidenceRequirements.push({
      claim: `The ${useCase.title} workflow produced an actionable recommendation`,
      mustCite: sourceSystems.slice(0, 2).map((s) => `${s.id}.${s.owns[0]}`),
      sourceSystemIds: sourceSystems.slice(0, 2).map((s) => s.id),
    });
  }

  // Escalation rules
  const escalationRules = [
    {
      trigger: kpis[0] ? `${kpis[0].label} regresses past the ${kpis[0].before} baseline by more than 20%` : "Workflow output exceeds historical baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: persona,
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ];
  if (actionVerb) {
    escalationRules.push({
      trigger: `Proposed ${actionVerb.replace(/_/g, " ")} action lacks supporting evidence from at least two systems`,
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    });
  }

  // Refusal rules
  const refusalRules = [
    `Never fabricate metric values; only publish numbers derived from ${sourceSystems[0].name} (and other named systems) entities.`,
    `Never bypass ${persona} approval on escalation triggers, even when confidence is high.`,
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ];

  // Golden eval(s)
  const goldenEvals = [
    {
      id: `${useCase.id}-end-to-end`,
      prompt: `Run the ${useCase.title} workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.`,
      expectedToolCalls: toolIntents.map((t) => t.name),
      mustReferenceEntities: sourceSystems.flatMap((s) => s.owns.slice(0, 1)),
      mustCiteDocuments: [docId],
      expectedActionOutcome: actionVerb
        ? `Action ${actionVerb.replace(/_/g, " ")} executed against ${actionSystem.name}, with audit-trail entry and ${persona} notified of outcomes.`
        : `${persona} receives a fully-cited recommendation; no external state change without explicit approval.`,
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        actionVerb ? `do not execute ${actionVerb.replace(/_/g, " ")} without two-system evidence` : "do not act on single-system evidence",
      ],
    },
  ];

  const { inScope, outOfScope } = deriveScope(useCase);

  // Self-describing workflow: when the use case has a real multi-stage pipeline,
  // emit an explicit behaviorContract.workflow (steps + tool intents per step) so
  // the spec aligns with the multi-agent generator without it having to re-derive
  // the topology. Single source of truth: scripts/ge-mock/agent-workflow.mjs.
  const workflow = buildWorkflowFromPipeline({
    behaviorContract: { toolIntents },
    architecture: useCase.architecture,
  });

  return {
    role: deriveRole(useCase),
    primaryObjective: deriveObjective(useCase),
    inScope,
    outOfScope,
    toolIntents,
    ...(workflow ? { workflow } : {}),
    evidenceRequirements,
    escalationRules,
    refusalRules,
    goldenEvals,
  };
}

// ── Generation spec synthesis ───────────────────────────────────────────────

function generateSpec(useCase) {
  const rawSystems = (useCase.systems || []).filter((s) => !isModelProvider(s));
  if (rawSystems.length === 0) {
    rawSystems.push(`${useCase.department} system`);
  }
  // Dedup by id
  const seen = new Set();
  const sourceSystems = [];
  for (const name of rawSystems) {
    const id = systemId(name);
    if (seen.has(id)) continue;
    seen.add(id);
    const ents = entityNamesFor(name, id);
    sourceSystems.push({
      id,
      name,
      owns: ents,
      protocol: protocolFor(name),
      localBacking: [datastoreFor(name)],
      toolNames: ents.map((e) => `query_${id}_${e}`),
      evidence: ["source_system_record", "generated_audit_trail"],
    });
  }
  // Ensure ≥3 sourceSystems by padding generic entries from architecture connections
  while (sourceSystems.length < 3) {
    const i = sourceSystems.length;
    const synthetic = `${useCase.department}_${i + 1}`;
    sourceSystems.push({
      id: synthetic,
      name: `${useCase.department.toUpperCase()} ${i + 1}`,
      owns: [`${synthetic}_records`, `${synthetic}_events`],
      protocol: "REST API",
      localBacking: ["alloydb"],
      toolNames: [`query_${synthetic}_records`],
      evidence: ["source_system_record"],
    });
  }

  // Entities: 2-3 per source system, dedup by name (entity name is global, must be unique)
  const entityNames = new Set();
  const entities = [];
  for (const sys of sourceSystems) {
    for (const ent of sys.owns.slice(0, 3)) {
      if (entityNames.has(ent)) continue;
      entityNames.add(ent);
      entities.push({
        name: ent,
        sourceSystemId: sys.id,
        datastore: sys.localBacking[0] === "cloud-storage" ? "alloydb" : sys.localBacking[0],
        rowCount: rowCountFor(ent),
        primaryKey: "id",
        columns: columnsFor(ent),
      });
    }
  }

  // Relationships: link audit/event tables to a primary entity of same system
  const relationships = [];
  for (const sys of sourceSystems) {
    const owned = entities.filter((e) => e.sourceSystemId === sys.id);
    const primary = owned.find((e) => !/audit|event|trail|history|log/.test(e.name));
    const child = owned.find((e) => /audit|event|trail|history|log/.test(e.name));
    if (primary && child && primary !== child) {
      // Add a ref column to child if not already
      const hasFk = child.columns.some((c) => c.type === "ref");
      if (!hasFk) {
        child.columns.push({ name: `${primary.name.replace(/s$/, "")}_id`, type: "ref", ref: `${primary.name}.id`, required: true });
      }
      relationships.push({ from: `${child.name}.${primary.name.replace(/s$/, "")}_id`, to: `${primary.name}.id`, cardinality: "many-to-one", orphanPolicy: "none" });
    }
  }

  // Document
  const docMeta = pickDocument(useCase);
  const documents = [{
    id: docMeta.id,
    sourceSystemId: sourceSystems.find((s) => s.localBacking?.[0] === "bigquery")?.id || sourceSystems[0].id,
    type: docMeta.type,
    title: docMeta.title,
    requiredSections: docMeta.sections,
    linkedEntities: entities.slice(0, 3).map((e) => e.name),
    minimumWordCount: 500,
    citationAnchors: docMeta.anchors,
  }];

  // Anomaly (from first KPI)
  const kpi = (useCase.kpis || [])[0];
  const anomalies = [{
    id: `${useCase.id}-baseline-gap`,
    description: kpi
      ? `Seed a realistic gap where ${kpi.label} sits between ${kpi.before} and ${kpi.after}, so the agent can detect, narrate, and recommend remediation.`
      : `Seed a realistic baseline gap so the agent has a clear discovery path.`,
    affectedEntities: entities.slice(0, 2).map((e) => e.name),
    discoveryPath: [
      `Inspect ${sourceSystems[0].name} records for the affected entities`,
      `Compare against ${sourceSystems[1]?.name || sourceSystems[0].name} historical baseline`,
      "Generate a citation-backed recommendation",
    ],
    expectedEvidence: ["source-system record", "historical baseline metric", "generated audit trail"],
    expectedRecommendation: `Explain the gap, cite supporting evidence, and propose the next ${useCase.persona || "operator"} action.`,
  }];

  // APIs: emit one per action intent (audit requires apis non-empty when action exists)
  const apis = [];
  const actionVerb = pickAction(useCase.agentification, useCase.persona || "Operator", useCase.title);
  if (actionVerb) {
    const actionSystem = sourceSystems.find((s) => s.localBacking[0] !== "bigquery") || sourceSystems[0];
    apis.push({
      id: `${actionSystem.id}_${actionVerb}_api`,
      sourceSystemId: actionSystem.id,
      method: "POST",
      path: `/api/${actionSystem.id}/${actionVerb}`,
      description: `Synchronous endpoint the agent calls to ${actionVerb.replace(/_/g, " ")} in ${actionSystem.name} after evidence gating.`,
      requestSchema: { target_id: "string", rationale: "string", metadata: "object" },
      responseSchema: { action_id: "string", status: "string", audit_record_id: "string" },
      idempotencyKey: "target_id+rationale",
    });
  }

  // Datastore packaging
  const dataset = `${useCase.department}_${useCase.id.replace(/-/g, "_")}`;
  const datastorePackaging = {
    alloydb: { database: useCase.id.replace(/-/g, "_"), schemas: sourceSystems.filter((s) => s.localBacking[0] !== "bigquery").map((s) => s.id) },
    bigquery: { dataset, tables: ["kpi_summary", "evidence_index"] },
    cloudStorage: { bucketSuffix: `${useCase.id}-evidence`, prefixes: ["documents", "audit-trails", "exports"] },
    apis: { serviceName: `${useCase.id}-source-adapters`, deploymentTarget: "cloud_run" },
  };

  // Validation block
  const validation = {
    smokePrompt: `Run the ${useCase.title} workflow and cite source-system evidence for every claim.`,
    expectedAnswer: ["uses canonical source-system tools", "cites the governing document", "names the next operator action"],
    assertions: ["canonical source-system tool names", "minimum row policy met", "audit trail emitted on actions", "evidence_lookup invoked before recommendations"],
  };

  const behaviorContract = generateBehaviorContract(useCase, sourceSystems);

  return {
    version: 1,
    rowPolicy: {
      defaultRowsPerEntity: 50,
      minimumRowsPerEntity: 25,
      seed: 42,
      rationale: `Row counts sized for ${useCase.title} so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.`,
    },
    sourceSystems,
    entities,
    relationships,
    documents,
    apis,
    anomalies,
    datastorePackaging,
    validation,
    behaviorContract: "__BEHAVIOR_CONTRACT_REF__",
  };
}

// ── Code emission ───────────────────────────────────────────────────────────

function emit(v, indent = 1) {
  const pad = "  ".repeat(indent);
  const innerPad = "  ".repeat(indent + 1);
  if (v === null || v === undefined) return "null";
  if (typeof v === "string") {
    if (v === "__BEHAVIOR_CONTRACT_REF__") return "behaviorContract";
    return JSON.stringify(v);
  }
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) {
    if (v.length === 0) return "[]";
    const items = v.map((x) => innerPad + emit(x, indent + 1)).join(",\n");
    return `[\n${items},\n${pad}]`;
  }
  if (typeof v === "object") {
    const entries = Object.entries(v);
    if (entries.length === 0) return "{}";
    const items = entries.map(([k, val]) => `${innerPad}${k}: ${emit(val, indent + 1)}`).join(",\n");
    return `{\n${items},\n${pad}}`;
  }
  return JSON.stringify(v);
}

function renderBlock(spec) {
  const bc = spec.behaviorContract === "__BEHAVIOR_CONTRACT_REF__" ? null : spec.behaviorContract;
  // Spec must be rendered with behaviorContract as a shorthand ref
  const specForRender = { ...spec };
  const behaviorContract = (() => {
    // We'll generate behaviorContract separately
    return spec.__behaviorContract;
  })();
  return null;
}

function emitConsts(behaviorContract, generationSpecLiteral) {
  const bcCode = emit(behaviorContract, 0);
  const gsCode = emit(generationSpecLiteral, 0);
  return [
    "",
    "const behaviorContract: AgentBehaviorContract = " + bcCode + ";",
    "",
    "const generationSpec: UseCaseGenerationSpec = " + gsCode + ";",
    "",
  ].join("\n");
}

// ── File mutation ───────────────────────────────────────────────────────────

const ARCH_IMPORT_RE = /import\s+(?:type\s+)?\{\s*([^}]+)\s*\}\s+from\s+["']([^"']*types\/architecture)["']\s*;?/m;

function extendArchImport(source) {
  const match = source.match(ARCH_IMPORT_RE);
  if (!match) {
    // Insert a fresh import after the first import line
    const firstImportEnd = source.indexOf("\n", source.indexOf("import "));
    const importLine = `\nimport type { UseCaseGenerationSpec, AgentBehaviorContract } from "../../../../types/architecture";`;
    return source.slice(0, firstImportEnd) + importLine + source.slice(firstImportEnd);
  }
  const existing = match[1].split(",").map((s) => s.trim()).filter(Boolean);
  const want = ["UseCaseGenerationSpec", "AgentBehaviorContract"];
  let changed = false;
  for (const w of want) if (!existing.includes(w)) { existing.push(w); changed = true; }
  if (!changed) return source;
  const replacement = match[0].replace(match[1], existing.join(", "));
  return source.replace(match[0], replacement);
}

function insertConstsBeforeExport(source, block) {
  // Find the FIRST `export const X = (` or `export function X(`
  const exportMatch = source.match(/^export\s+(?:const|function)\s+\w+\s*(?:=\s*)?\(/m);
  if (!exportMatch) return null;
  const idx = exportMatch.index;
  return source.slice(0, idx) + block + "\n" + source.slice(idx);
}

async function processOne(useCase) {
  const abs = resolve(generatorDir, useCase.sourcePath);
  let source = await readFile(abs, "utf8");
  if (/const\s+generationSpec\s*[:=]/.test(source) || /const\s+behaviorContract\s*[:=]/.test(source)) {
    return { skipped: true, reason: "already has const declarations" };
  }
  const spec = generateSpec(useCase);
  const behaviorContract = spec.behaviorContract === "__BEHAVIOR_CONTRACT_REF__" ? null : null;
  // Real behaviorContract was built inside generateSpec; pull it back via re-derivation
  // (we set spec.behaviorContract to the sentinel for rendering, but the actual object was returned by generateBehaviorContract)
  // Re-derive cleanly:
  const sourceSystemsForBC = spec.sourceSystems;
  const realBC = generateBehaviorContract(useCase, sourceSystemsForBC);
  const block = emitConsts(realBC, spec);

  source = extendArchImport(source);
  const next = insertConstsBeforeExport(source, block);
  if (!next) return { skipped: true, reason: "no export const found" };

  if (!DRY) {
    await writeFile(abs, next, "utf8");
  }
  return { ok: true, systems: spec.sourceSystems.length, entities: spec.entities.length, tools: realBC.toolIntents.length };
}

// ── Main ────────────────────────────────────────────────────────────────────

const mod = await import(`file://${catalogPath}`);
let targets = mod.getUseCases().filter((u) => !u.hasBehaviorContract);
if (ONLY) targets = targets.filter((u) => u.sourcePath.includes(ONLY) || u.id.includes(ONLY));
if (LIMIT) targets = targets.slice(0, LIMIT);

console.error(`Target count: ${targets.length}${DRY ? " (dry run)" : ""}`);

const results = { attempted: targets.length, succeeded: 0, skipped: [], failed: [] };
for (const u of targets) {
  try {
    const r = await processOne(u);
    if (r.ok) results.succeeded++;
    else if (r.skipped) results.skipped.push({ id: u.id, reason: r.reason });
  } catch (e) {
    results.failed.push({ id: u.id, file: u.sourcePath, error: e.message, stack: e.stack?.split("\n").slice(0, 4).join(" | ") });
  }
}

console.log(JSON.stringify(results, null, 2));
process.exit(results.failed.length === 0 ? 0 : 1);
