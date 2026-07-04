---
type: Workflow Stage
title: "Effectivity & Stranded-Cost Scoring"
description: "Score candidate effectivity_date options against historical_metrics and analytics_events baselines in BigQuery via query_bigquery_historical_metrics and query_bigquery_analytics_events to quantify the stranded-inventory and open-order cost trade-off for each date."
source_id: effectivity_stranded_cost_scoring
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Effectivity & Stranded-Cost Scoring

Score candidate effectivity_date options against historical_metrics and analytics_events baselines in BigQuery via query_bigquery_historical_metrics and query_bigquery_analytics_events to quantify the stranded-inventory and open-order cost trade-off for each date.

- **Mode:** sequential
- **Stage:** 4 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_eco_impact_analysis_agent_sop](/tools/lookup-eco-impact-analysis-agent-sop.md)

Next: [SOP & Evidence Gate](/workflow/sop-evidence-gate.md)
