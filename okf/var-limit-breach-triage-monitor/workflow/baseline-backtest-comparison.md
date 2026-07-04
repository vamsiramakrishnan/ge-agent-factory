---
type: Workflow Stage
title: "Baseline & Backtest Comparison"
description: "Compare measure_value against BigQuery historical_metrics and analytics_events, and check backtest_exceptions_250d to determine whether the breach is a one-off market move or a clustering pattern."
source_id: baseline_backtest_comparison
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Baseline & Backtest Comparison

Compare measure_value against BigQuery historical_metrics and analytics_events, and check backtest_exceptions_250d to determine whether the breach is a one-off market move or a clustering pattern.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_var_limit_breach_triage_monitor_compliance_policy](/tools/lookup-var-limit-breach-triage-monitor-compliance-policy.md)

Next: [Policy-Gated Severity Scoring](/workflow/policy-gated-severity-scoring.md)
