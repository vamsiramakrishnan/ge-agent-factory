---
type: Eval Scenario
title: Run the Store Labor Forecast Engine workflow for the current period. Cite the...
description: "Run the Store Labor Forecast Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "store-labor-forecast-engine-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Store Labor Forecast Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [demand-signal-capture](/queries/demand-signal-capture.md)

## Mechanisms to call

- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_store_labor_forecast_engine_execution_playbook](/tools/lookup-store-labor-forecast-engine-execution-playbook.md)
- [action_ukg_dimensions_recommend](/tools/action-ukg-dimensions-recommend.md)

## Success rubric

Action recommend executed against UKG Dimensions, with audit-trail entry and Store Workforce Planner notified of outcomes.

# Citations

- [Store Labor Forecast Engine Retail Execution Playbook](/documents/store-labor-forecast-engine-execution-playbook.md)
