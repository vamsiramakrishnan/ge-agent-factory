---
type: Proof Obligation
title: "Golden eval obligation — Run the Inbound PO ETA Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-inbound-po-eta-monitor-end-to-end"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Inbound PO ETA Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [inbound-po-eta-monitor-end-to-end](/tests/inbound-po-eta-monitor-end-to-end.md)


## Mechanisms

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_inbound_po_eta_monitor_execution_playbook](/tools/lookup-inbound-po-eta-monitor-execution-playbook.md)
- [action_manhattan_active_wm_escalate](/tools/action-manhattan-active-wm-escalate.md)

## Entities that must be referenced

- warehouse_orders
- item_master
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute escalate without two-system evidence

# Citations

- [inbound-po-eta-monitor-execution-playbook](/documents/inbound-po-eta-monitor-execution-playbook.md)
