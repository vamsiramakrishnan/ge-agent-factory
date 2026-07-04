---
type: Workflow Stage
title: "Burn-Down Trend & Readiness Scoring"
description: "Compare current completion velocity against historical_metrics and analytics_events in BigQuery (query_bigquery_analytics_events) to project each deliverable's finish date against the gate date and score it green/yellow/red while there is still runway to recover."
source_id: burn_down_trend_readiness_scoring
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Burn-Down Trend & Readiness Scoring

Compare current completion velocity against historical_metrics and analytics_events in BigQuery (query_bigquery_analytics_events) to project each deliverable's finish date against the gate date and score it green/yellow/red while there is still runway to recover.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_npi_launch_readiness_orchestrator_sop](/tools/lookup-npi-launch-readiness-orchestrator-sop.md)

Next: [Change-Class & Export-Control Gate Check](/workflow/change-class-export-control-gate-check.md)
