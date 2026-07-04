---
type: Workflow Stage
title: "Historical Benchmark & Conversion Analytics"
description: "Compare the lead's response-time and conversion signals against BigQuery analytics_events and historical_metrics, and pull Looker dashboards to confirm the lead qualifies against current-quarter MQL-to-SQL baselines."
source_id: historical_benchmark_conversion_analytics
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Historical Benchmark & Conversion Analytics

Compare the lead's response-time and conversion signals against BigQuery analytics_events and historical_metrics, and pull Looker dashboards to confirm the lead qualifies against current-quarter MQL-to-SQL baselines.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_lead_qualification_scoring_engine_assurance_runbook](/tools/lookup-lead-qualification-scoring-engine-assurance-runbook.md)

Next: [Policy & Discount Gate](/workflow/policy-discount-gate.md)
