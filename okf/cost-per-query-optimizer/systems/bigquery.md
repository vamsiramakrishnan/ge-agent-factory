---
type: Source System
title: BigQuery
description: "Query logs, table metadata, partition/cluster config, cost data"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# BigQuery

Query logs, table metadata, partition/cluster config, cost data

- **Protocol:** BigQuery SQL
- **Local backing:** bigquery

# Schema

- [analytics_events](/tables/analytics-events.md)
- [historical_metrics](/tables/historical-metrics.md)
- [cached_aggregates](/tables/cached-aggregates.md)

## Tools using this system

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_cost_per_query_optimizer_runbook](/tools/lookup-cost-per-query-optimizer-runbook.md)
- [action_bigquery_recommend](/tools/action-bigquery-recommend.md)
