---
type: Workflow Stage
title: "Aging Waterfall & Baseline Comparison"
description: "Compare current open-exception counts and age-in-days against BigQuery historical_metrics, analytics_events, and cached_aggregates to build the weekly aging waterfall against the 2,400-to-350 exception-count baseline."
source_id: aging_waterfall_baseline_comparison
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Aging Waterfall & Baseline Comparison

Compare current open-exception counts and age-in-days against BigQuery historical_metrics, analytics_events, and cached_aggregates to build the weekly aging waterfall against the 2,400-to-350 exception-count baseline.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_loan_doc_exception_clearing_agent_compliance_policy](/tools/lookup-loan-doc-exception-clearing-agent-compliance-policy.md)

Next: [Compliance & Cure-Runbook Gating](/workflow/compliance-cure-runbook-gating.md)
