---
type: Workflow Stage
title: "Sell-Through & Variance Scoring"
description: "Query analytics_events, historical_metrics, and cached_aggregates in BigQuery to score out-of-stock and weeks-of-supply variance by store-SKU and prioritize the Allocation Analyst's exception queue."
source_id: sell_through_variance_scoring
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Sell-Through & Variance Scoring

Query analytics_events, historical_metrics, and cached_aggregates in BigQuery to score out-of-stock and weeks-of-supply variance by store-SKU and prioritize the Allocation Analyst's exception queue.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_store_replenishment_orchestrator_execution_playbook](/tools/lookup-store-replenishment-orchestrator-execution-playbook.md)

Next: [Playbook & Rate-Manual Gate](/workflow/playbook-rate-manual-gate.md)
