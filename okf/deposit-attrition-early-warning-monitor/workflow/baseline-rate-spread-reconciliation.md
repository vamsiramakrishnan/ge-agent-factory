---
type: Workflow Stage
title: "Baseline & Rate-Spread Reconciliation"
description: "Compare flagged core_accounts balances against BigQuery historical_metrics and analytics_events (query_bigquery_analytics_events) to strip out seasonal or reporting-lag noise and isolate outflow attributable to competitor rate spreads."
source_id: baseline_rate_spread_reconciliation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Baseline & Rate-Spread Reconciliation

Compare flagged core_accounts balances against BigQuery historical_metrics and analytics_events (query_bigquery_analytics_events) to strip out seasonal or reporting-lag noise and isolate outflow attributable to competitor rate spreads.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_deposit_attrition_early_warning_monitor_compliance_policy](/tools/lookup-deposit-attrition-early-warning-monitor-compliance-policy.md)

Next: [Risk Scoring & Retention Worklist Ranking](/workflow/risk-scoring-retention-worklist-ranking.md)
