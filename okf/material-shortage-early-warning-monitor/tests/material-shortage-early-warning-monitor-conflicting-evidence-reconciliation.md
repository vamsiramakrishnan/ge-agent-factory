---
type: Eval Scenario
title: Supply plan 6042117 for material_number 431208 is plan_status committed with ...
description: "Supply plan 6042117 for material_number 431208 is plan_status committed with planned_supply_qty 1,200 units landing 2026-07-18, but the linked purchase order (source_record_id 8891, vendor Meridian Fasteners Inc, amount $18,400) carries due_date 2026-08-02 -- after the line needs it. Scenario run 100482 dated 2026-07-01 also shows solver_status infeasible for this material at plant 1020. Reconcile the shortage and tell me what to do before tomorrow's build."
source_id: "material-shortage-early-warning-monitor-conflicting-evidence-reconciliation"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Supply plan 6042117 for material_number 431208 is plan_status committed with planned_supply_qty 1,200 units landing 2026-07-18, but the linked purchase order (source_record_id 8891, vendor Meridian Fasteners Inc, amount $18,400) carries due_date 2026-08-02 -- after the line needs it. Scenario run 100482 dated 2026-07-01 also shows solver_status infeasible for this material at plant 1020. Reconcile the shortage and tell me what to do before tomorrow's build.

## Validates

- [coverage-netting](/queries/coverage-netting.md)

## Mechanisms to call

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_material_shortage_early_warning_monitor_sop](/tools/lookup-material-shortage-early-warning-monitor-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Material Shortage Early Warning Monitor Standard Operating Procedure](/documents/material-shortage-early-warning-monitor-sop.md)
- [Expedite & Allocation Authority Matrix](/documents/expedite-allocation-authority-matrix.md)
