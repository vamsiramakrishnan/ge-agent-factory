---
type: Workflow Stage
title: Retrieve Records
description: Query warehouse orders and pick tasks from Manhattan Active WM and correlate with UKG Dimensions for the DC Labor Planning Engine workflow.
source_id: retrieve_records
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query warehouse orders and pick tasks from Manhattan Active WM and correlate with UKG Dimensions for the DC Labor Planning Engine workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [lookup_dc_labor_planning_engine_execution_playbook](/tools/lookup-dc-labor-planning-engine-execution-playbook.md)
- [action_manhattan_active_wm_generate](/tools/action-manhattan-active-wm-generate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
