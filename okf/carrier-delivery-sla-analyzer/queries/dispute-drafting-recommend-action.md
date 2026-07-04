---
type: Query Capability
title: "Execute action_manhattan_active_wm_recommend to file dispute claims or lane-r..."
description: "Execute action_manhattan_active_wm_recommend to file dispute claims or lane-reassignment recommendations in Manhattan Active WM with a full audit trail, escalating to the Transportation Manager when evidence or thresholds are not met."
source_id: "dispute-drafting-recommend-action"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute action_manhattan_active_wm_recommend to file dispute claims or lane-reassignment recommendations in Manhattan Active WM with a full audit trail, escalating to the Transportation Manager when evidence or thresholds are not met.

## Tools used

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [action_manhattan_active_wm_recommend](/tools/action-manhattan-active-wm-recommend.md)

## Runs in

- [dispute_drafting_recommend_action](/workflow/dispute-drafting-recommend-action.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Carrier Delivery SLA Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/carrier-delivery-sla-analyzer-end-to-end.md)
- [Carrier XPO disputes a $1,850 late-delivery deduction on warehouse order #48213910 out of DC 12 (ship date 2026-06-18), claiming an on-time delivery. The only evidence in Manhattan Active WM right now is the warehouse_orders ship-date field — pick_tasks for that load hasn't synced yet. Before you reverse the deduction, check BigQuery analytics_events for DC 12's on-time trend this period and tell me whether we can adjudicate this claim now or need more evidence.](/tests/carrier-delivery-sla-analyzer-invoice-dispute-reconciliation.md)

# Citations

- [Carrier Delivery SLA Analyzer Retail Execution Playbook](/documents/carrier-delivery-sla-analyzer-execution-playbook.md)
- [Carrier Rate Card & Claims Adjudication Policy](/documents/carrier-rate-claims-adjudication-policy.md)
