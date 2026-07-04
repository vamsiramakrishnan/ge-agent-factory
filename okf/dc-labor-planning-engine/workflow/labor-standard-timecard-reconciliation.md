---
type: Workflow Stage
title: "Labor Standard & Timecard Reconciliation"
description: "Cross-check UKG Dimensions timecards and shift_schedules against Manhattan Active WM engineered pick rates (pick_tasks cases_per_hour) so the labor standard is true before it feeds the forecast."
source_id: labor_standard_timecard_reconciliation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Labor Standard & Timecard Reconciliation

Cross-check UKG Dimensions timecards and shift_schedules against Manhattan Active WM engineered pick rates (pick_tasks cases_per_hour) so the labor standard is true before it feeds the forecast.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [lookup_dc_labor_planning_engine_execution_playbook](/tools/lookup-dc-labor-planning-engine-execution-playbook.md)
- [action_manhattan_active_wm_generate](/tools/action-manhattan-active-wm-generate.md)

Next: [Capacity Gap Scoring](/workflow/capacity-gap-scoring.md)
