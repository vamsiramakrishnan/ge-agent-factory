---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull usage_records and rated_events from Amdocs CES Billing and reconcile mediation_batch totals against rated_amount_usd by rating_group, flagging guiding_status exceptions (suspense, rejected, rerated) before they reach the next bill run.](/queries/mediation-to-rating-reconciliation.md)
- [Cross-match active billing_accounts against BigQuery historical_metrics and analytics_events baselines to surface services that are provisioned and consuming usage_records but never rated into the billing catalog.](/queries/unbilled-service-detection-provisioning-vs-catalog.md)
- [Score variance_pct anomalies from analytics_events and Looker dashboards against historical_metrics baselines, then rank leakage cases by recoverable_amount, credit_class, and account_status for the Revenue Assurance Analyst queue.](/queries/leakage-case-scoring-prioritization.md)
- [Invoke lookup_revenue_leakage_detection_analyzer_assurance_runbook and the Adjustment & Write-Off Delegation of Authority Policy to confirm two-system evidence and delegation limits are satisfied before any rated_events or billing_accounts recommendation is issued.](/queries/runbook-gated-evidence-validation.md)
- [Execute action_amdocs_ces_billing_create to open or update the case against billing_accounts with a generated_audit_trail, escalating to billing_operations_supervisor or revenue_assurance_manager whenever delegation or staleness thresholds are breached.](/queries/recovery-action-escalation-audit-trail.md)
