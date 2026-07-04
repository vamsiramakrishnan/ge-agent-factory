---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Compare rated_events.rated_amount_usd and rate_plan_code against historical_metrics and analytics_events in BigQuery to baseline rated revenue per product, plan, and event_type, and flag deviations within hours of any Amdocs CES Billing catalog/tariff push.](/queries/catalog-change-baseline-watch.md)
- [Pull usage_records and rated_events from Amdocs CES Billing to classify records sitting in guiding_status=suspense or rejected by failure cause (rating_group, mediation_batch, missing subscriber_key) and identify which match known auto-reprocess correction patterns.](/queries/suspense-guiding-status-triage.md)
- [Cross-reference billing_accounts.bill_cycle_day and dashboards KPI views in Looker against flagged rated_events to determine which upcoming bill runs would ship a misrated invoice, and size the exposure before invoice generation.](/queries/bill-cycle-impact-assessment.md)
- [Look up the governing sections of the Usage Rating Anomaly Monitor Service Assurance Runbook and the Rerate & Bill-Cycle Hold Governance Policy via lookup_usage_rating_anomaly_monitor_assurance_runbook, and confirm two-system evidence before any recommendation is drafted.](/queries/runbook-gated-evidence-validation.md)
- [Execute action_amdocs_ces_billing_recommend against Amdocs CES Billing to hold the affected bill cycle or trigger reprocessing, emit the audit trail, and escalate exceptions to the Revenue Assurance Analyst or revenue_assurance_manager.](/queries/recommend-hold-audit.md)
