---
type: Query Capability
title: "Calculate YoY/QoQ trends, traffic-light status indicators, and drill-down ana..."
description: "Calculate YoY/QoQ trends, traffic-light status indicators, and drill-down analytics by business unit, region, and product line."
source_id: "trend-status-computation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Calculate YoY/QoQ trends, traffic-light status indicators, and drill-down analytics by business unit, region, and product line.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

## Runs in

- [trend_status_computation](/workflow/trend-status-computation.md)

## Evidence expected

- sql_result

## Evals

- [Run the Management Reporting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/management-reporting-agent-end-to-end.md)

# Citations

- [Management Reporting Agent Controls Playbook](/documents/management-reporting-agent-controls-playbook.md)
