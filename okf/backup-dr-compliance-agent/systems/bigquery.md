---
type: Source System
title: BigQuery
description: "Backup history, RPO/RTO compliance tracking, storage growth"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# BigQuery

Backup history, RPO/RTO compliance tracking, storage growth

- **Protocol:** BigQuery SQL
- **Local backing:** bigquery

# Schema

- [analytics_events](/tables/analytics-events.md)
- [historical_metrics](/tables/historical-metrics.md)
- [cached_aggregates](/tables/cached-aggregates.md)

## Tools using this system

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_backup_dr_compliance_agent_runbook](/tools/lookup-backup-dr-compliance-agent-runbook.md)
