---
type: Workflow Stage
title: "Productivity & Transferable-Demand Scoring"
description: "Score SKU productivity, incrementality, and transferable demand by comparing analytics_events against historical_metrics and cached_aggregates in BigQuery for the same period and metric_name."
source_id: productivity_transferable_demand_scoring
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Productivity & Transferable-Demand Scoring

Score SKU productivity, incrementality, and transferable demand by comparing analytics_events against historical_metrics and cached_aggregates in BigQuery for the same period and metric_name.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_assortment_rationalization_engine_execution_playbook](/tools/lookup-assortment-rationalization-engine-execution-playbook.md)

Next: [Playbook & Trade-Terms Evidence Gating](/workflow/playbook-trade-terms-evidence-gating.md)
