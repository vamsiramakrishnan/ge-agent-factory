// ── Column heuristics per entity name ───────────────────────────────────────

export function columnsFor(entityName) {
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

export function isReferenceTable(name) {
  return /(rule|policy|playbook|runbook|handbook|configuration|reference|catalog_item|metric_definition|named_range|escalation_policy|control)/i.test(name);
}

export function rowCountFor(name) {
  return isReferenceTable(name) ? 30 : 60;
}
