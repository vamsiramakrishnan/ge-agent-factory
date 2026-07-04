---
type: Workflow Stage
title: "Performance, Drift & Fee Analysis"
description: "Join BigQuery analytics_events against historical_metrics and cached_aggregates to compute performance-versus-benchmark, allocation drift, fee summary, and cash-flow variance_pct for each account."
source_id: performance_drift_fee_analysis
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Performance, Drift & Fee Analysis

Join BigQuery analytics_events against historical_metrics and cached_aggregates to compute performance-versus-benchmark, allocation drift, fee summary, and cash-flow variance_pct for each account.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_portfolio_review_prep_agent_compliance_policy](/tools/lookup-portfolio-review-prep-agent-compliance-policy.md)

Next: [Suitability & Concentration Compliance Check](/workflow/suitability-concentration-compliance-check.md)
