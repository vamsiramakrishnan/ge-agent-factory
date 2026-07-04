---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull fresh cart_events and online_orders from Salesforce Commerce Cloud (query_salesforce_commerce_cloud_online_orders) and cross-reference Segment segment_records for session-level intent and device signals before any scoring begins.](/queries/cart-session-signal-capture.md)
- [Rank each abandoned cart against product_catalog_entries availability/catalog_status and BigQuery analytics_events/historical_metrics baselines (query_bigquery_analytics_events) to separate high-intent shoppers from bots and price-checkers.](/queries/intent-margin-stock-risk-scoring.md)
- [Match scored carts to the compliant play — reminder, social proof, low-stock nudge, or minimal viable incentive — gated against the Cart Abandonment Recovery Orchestrator Retail Execution Playbook's promotion guardrails via lookup_cart_abandonment_recovery_orchestrator_execution_playbook.](/queries/recovery-play-incentive-guardrail-selection.md)
- [Draft and dispatch the chosen journey through Salesforce Marketing Cloud accounts and campaign_influence records (query_salesforce_marketing_cloud_accounts), suppressing any session whose cart_events log shows a complete_purchase or remove_from_cart event first.](/queries/marketing-cloud-journey-orchestration-suppression.md)
- [Execute action_salesforce_commerce_cloud_send only once two-system evidence is assembled, emit the audit_record_id, and escalate discount-creep or catalog exceptions to the Digital Marketing Manager or digital_operations_oncall.](/queries/evidence-gated-send-audit.md)
