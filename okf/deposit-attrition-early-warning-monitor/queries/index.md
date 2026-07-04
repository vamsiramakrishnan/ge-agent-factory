---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query core_accounts and account_transactions from Temenos Transact via query_temenos_transact_core_accounts to compute balance velocity, external transfer share, and standing_orders redirection patterns for every deposit relationship.](/queries/weekly-balance-velocity-outflow-scan.md)
- [Compare flagged core_accounts balances against BigQuery historical_metrics and analytics_events (query_bigquery_analytics_events) to strip out seasonal or reporting-lag noise and isolate outflow attributable to competitor rate spreads.](/queries/baseline-rate-spread-reconciliation.md)
- [Rank each surviving at-risk household into the retention worklist with a recommended offer and talking points, gating offer size against the Deposit Retention Offer Authority & Rate Exception Matrix via lookup_deposit_attrition_early_warning_monitor_compliance_policy.](/queries/risk-scoring-retention-worklist-ranking.md)
- [Publish the attrition heatmap and worklist summary to Looker dashboards (query_looker_dashboards) and notify Retail Deposits Product Managers when a segment's outflow variance breaches the metric_definitions threshold.](/queries/segment-heatmap-publication-to-looker.md)
- [Execute action_temenos_transact_publish to push the finalized worklist and heatmap update against Temenos Transact with a full audit trail, escalating threshold breaches and offer-authority exceptions to the Retail Deposits Product Manager.](/queries/evidence-gated-publish-escalation.md)
