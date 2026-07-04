---
type: Eval Scenario
title: "Run the Demand-Supply Gap Scenario Engine workflow for the current period. Ci..."
description: "Run the Demand-Supply Gap Scenario Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "demand-supply-gap-scenario-engine-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Demand-Supply Gap Scenario Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_demand_supply_gap_scenario_engine_sop](/tools/lookup-demand-supply-gap-scenario-engine-sop.md)
- [action_kinaxis_rapidresponse_publish](/tools/action-kinaxis-rapidresponse-publish.md)

## Success rubric

Action publish executed against Kinaxis RapidResponse, with audit-trail entry and S&OP Manager notified of outcomes.

# Citations

- [Demand-Supply Gap Scenario Engine Standard Operating Procedure](/documents/demand-supply-gap-scenario-engine-sop.md)
