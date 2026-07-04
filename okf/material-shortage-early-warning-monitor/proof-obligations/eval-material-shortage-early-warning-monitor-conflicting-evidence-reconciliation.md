---
type: Proof Obligation
title: "Golden eval obligation — Supply plan 6042117 for material_number 431208 is plan_status committed with planned_supply_qty 1,200 units landing 2026-07-18, but the linked purchase order (source_record_id 8891, vendor Meridian Fasteners Inc, amount $18,400) carries due_date 2026-08-02 -- after the line needs it. Scenario run 100482 dated 2026-07-01 also shows solver_status infeasible for this material at plant 1020. Reconcile the shortage and tell me what to do before tomorrow's build."
description: golden eval proof obligation
source_id: "eval-material-shortage-early-warning-monitor-conflicting-evidence-reconciliation"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Supply plan 6042117 for material_number 431208 is plan_status committed with planned_supply_qty 1,200 units landing 2026-07-18, but the linked purchase order (source_record_id 8891, vendor Meridian Fasteners Inc, amount $18,400) carries due_date 2026-08-02 -- after the line needs it. Scenario run 100482 dated 2026-07-01 also shows solver_status infeasible for this material at plant 1020. Reconcile the shortage and tell me what to do before tomorrow's build.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [material-shortage-early-warning-monitor-conflicting-evidence-reconciliation](/tests/material-shortage-early-warning-monitor-conflicting-evidence-reconciliation.md)


## Mechanisms

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_material_shortage_early_warning_monitor_sop](/tools/lookup-material-shortage-early-warning-monitor-sop.md)

## Entities that must be referenced

- supply_plans
- purchase_orders
- scenario_runs

## Forbidden behaviors

- committing a new delivery date to production without an available-to-promise/capable-to-promise check against real supply
- invoking action_sap_s_4hana_mm_draft before reconciling the conflicting plan and PO dates

# Citations

- [material-shortage-early-warning-monitor-sop](/documents/material-shortage-early-warning-monitor-sop.md)
- [expedite-allocation-authority-matrix](/documents/expedite-allocation-authority-matrix.md)
