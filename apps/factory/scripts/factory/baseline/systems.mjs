// ── System metadata library ──────────────────────────────────────────────────

export const PROTOCOL_BY_SYSTEM = [
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

export const DATASTORE_BY_CATEGORY = {
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

export const SYSTEM_CATEGORY = [
  [/sap|workday|oracle|netsuite|servicenow|coupa|ariba|greenhouse|lever|highradius|kyriba|blackline|anaplan|salesforce|hubspot|marketo|jira|icertis|docusign|jaggaer|benefitfocus|lattice|culture amp|qualtrics|zendesk|freshdesk|intercom/i, "erp"],
  [/bigquery|snowflake|databricks|redshift|looker|tableau|powerbi|adobe analytics|google analytics|ga4|amplitude|mixpanel|segment/i, "analytics"],
  [/google drive|google docs|google slides|google sheets|sharepoint|confluence|notion|box|dropbox|bynder|frame\.io|figma|canva|wordpress|contentful|drupal/i, "doc"],
  [/slack|gmail|google chat|outlook|teams|intercom messaging|sms|twilio/i, "messaging"],
  [/datadog|pagerduty|opsgenie|splunk|new relic|prometheus|grafana|cloudwatch|stackdriver/i, "observability"],
  [/github|gitlab|bitbucket|jenkins|argocd|circleci|kubernetes|gke|eks|aks|terraform|ansible|puppet/i, "workflow"],
  [/okta|auth0|ping|active directory|azure ad|entra/i, "workflow"],
  [/google ads|meta ads|linkedin ads|tiktok ads|adwords/i, "analytics"],
];

export const SYSTEM_ENTITIES = [
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

export function snake(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[\(\)]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    || "system";
}

export function systemId(name) {
  return snake(name.replace(/\bAI\b/g, "ai"));
}

export function isModelProvider(name) {
  return /vertex\s*ai|gemini|openai|anthropic|claude|chatgpt|llm$/i.test(name);
}

export function categoryFor(name) {
  for (const [re, cat] of SYSTEM_CATEGORY) if (re.test(name)) return cat;
  return "erp";
}

export function datastoreFor(name) {
  return DATASTORE_BY_CATEGORY[categoryFor(name)] || "alloydb";
}

export function protocolFor(name, fallback) {
  for (const [re, p] of PROTOCOL_BY_SYSTEM) if (re.test(name)) return p;
  return fallback || "REST API";
}

export function entityNamesFor(name, sysId) {
  for (const [re, ents] of SYSTEM_ENTITIES) if (re.test(name)) return ents;
  return [`${sysId}_records`, `${sysId}_events`, `${sysId}_audit_trail`];
}
