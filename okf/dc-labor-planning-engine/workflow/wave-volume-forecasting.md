---
type: Workflow Stage
title: Wave Volume Forecasting
description: "Query warehouse_orders and pick_tasks from Manhattan Active WM and correlate against inbound ASN volume to project function-level wave workload 72 hours out for the DC Labor Planning Engine workflow."
source_id: wave_volume_forecasting
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Wave Volume Forecasting

Query warehouse_orders and pick_tasks from Manhattan Active WM and correlate against inbound ASN volume to project function-level wave workload 72 hours out for the DC Labor Planning Engine workflow.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [lookup_dc_labor_planning_engine_execution_playbook](/tools/lookup-dc-labor-planning-engine-execution-playbook.md)
- [action_manhattan_active_wm_generate](/tools/action-manhattan-active-wm-generate.md)

Next: [Labor Standard & Timecard Reconciliation](/workflow/labor-standard-timecard-reconciliation.md)
