---
type: Eval Scenario
title: Run the Safety Observation Trend Analyzer workflow for the current period. Ci...
description: "Run the Safety Observation Trend Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "safety-observation-trend-analyzer-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Safety Observation Trend Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_safety_observation_trend_analyzer_sop](/tools/lookup-safety-observation-trend-analyzer-sop.md)
- [action_sphera_ehs_publish](/tools/action-sphera-ehs-publish.md)

## Success rubric

Action publish executed against Sphera EHS, with audit-trail entry and Plant Safety Coordinator notified of outcomes.

# Citations

- [Safety Observation Trend Analyzer Standard Operating Procedure](/documents/safety-observation-trend-analyzer-sop.md)
