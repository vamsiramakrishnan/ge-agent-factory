---
type: Source System
title: BigQuery
description: "Process event data warehouse, cycle time metrics, SLA tracking tables"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# BigQuery

Process event data warehouse, cycle time metrics, SLA tracking tables

- **Protocol:** BigQuery SQL
- **Local backing:** bigquery

# Schema

- [analytics_events](/tables/analytics-events.md)
- [historical_metrics](/tables/historical-metrics.md)
- [cached_aggregates](/tables/cached-aggregates.md)

## Tools using this system

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_p2p_cycle_time_analyzer_policy_guide](/tools/lookup-p2p-cycle-time-analyzer-policy-guide.md)
