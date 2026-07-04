---
type: Workflow Stage
title: "Risk-Ranked Schedule Build"
description: "Score equipment age, alarm trends, and storm-season timing for each site against historical_metrics and cached_aggregates baselines in BigQuery to rank preventive maintenance priority across the tower portfolio."
source_id: risk_ranked_schedule_build
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Risk-Ranked Schedule Build

Score equipment age, alarm trends, and storm-season timing for each site against historical_metrics and cached_aggregates baselines in BigQuery to rank preventive maintenance priority across the tower portfolio.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_tower_maintenance_scheduling_engine_assurance_runbook](/tools/lookup-tower-maintenance-scheduling-engine-assurance-runbook.md)

Next: [Crew & Visit Bundling](/workflow/crew-visit-bundling.md)
