---
type: Query Capability
title: "Execute the recommend step in Manhattan Active WM with a full audit trail, an..."
description: "Execute the recommend step in Manhattan Active WM with a full audit trail, and escalate exceptions to the Transportation Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the recommend step in Manhattan Active WM with a full audit trail, and escalate exceptions to the Transportation Manager.

## Tools used

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [action_manhattan_active_wm_recommend](/tools/action-manhattan-active-wm-recommend.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Carrier Delivery SLA Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/carrier-delivery-sla-analyzer-end-to-end.md)

# Citations

- [Carrier Delivery SLA Analyzer Retail Execution Playbook](/documents/carrier-delivery-sla-analyzer-execution-playbook.md)
