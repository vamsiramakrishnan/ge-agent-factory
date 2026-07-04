---
type: Workflow Stage
title: Break Pattern Matching Against Historical Library
description: "Query analytics_events and historical_metrics in BigQuery (query_bigquery_analytics_events) to match residual, unexplained breaks against the learned break-pattern library and draft a likely-cause narrative."
source_id: break_pattern_matching_against_historical_library
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Break Pattern Matching Against Historical Library

Query analytics_events and historical_metrics in BigQuery (query_bigquery_analytics_events) to match residual, unexplained breaks against the learned break-pattern library and draft a likely-cause narrative.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_eod_pnl_attribution_analyzer_compliance_policy](/tools/lookup-eod-pnl-attribution-analyzer-compliance-policy.md)

Next: [Evidence & Compliance Policy Gating](/workflow/evidence-compliance-policy-gating.md)
