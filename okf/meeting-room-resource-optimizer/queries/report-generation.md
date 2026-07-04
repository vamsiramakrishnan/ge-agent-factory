---
type: Query Capability
title: "Generate weekly space analytics report with utilization heat maps, cost-per-s..."
description: "Generate weekly space analytics report with utilization heat maps, cost-per-seat analysis, and reconfiguration business cases."
source_id: "report-generation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate weekly space analytics report with utilization heat maps, cost-per-seat analysis, and reconfiguration business cases.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

## Runs in

- [report_generation](/workflow/report-generation.md)

## Evidence expected

- sql_result

## Evals

- [Run the Meeting Room & Resource Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/meeting-room-resource-optimizer-end-to-end.md)

# Citations

- [Meeting Room & Resource Optimizer Operations Runbook](/documents/meeting-room-resource-optimizer-runbook.md)
