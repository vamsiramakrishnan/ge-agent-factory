---
type: Eval Scenario
title: Run the DC Labor Planning Engine workflow for the current period. Cite the re...
description: "Run the DC Labor Planning Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "dc-labor-planning-engine-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the DC Labor Planning Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [labor-standard-timecard-reconciliation](/queries/labor-standard-timecard-reconciliation.md)

## Mechanisms to call

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_dc_labor_planning_engine_execution_playbook](/tools/lookup-dc-labor-planning-engine-execution-playbook.md)
- [action_manhattan_active_wm_generate](/tools/action-manhattan-active-wm-generate.md)

## Success rubric

Action generate executed against Manhattan Active WM, with audit-trail entry and DC Operations Manager notified of outcomes.

# Citations

- [DC Labor Planning Engine Retail Execution Playbook](/documents/dc-labor-planning-engine-execution-playbook.md)
