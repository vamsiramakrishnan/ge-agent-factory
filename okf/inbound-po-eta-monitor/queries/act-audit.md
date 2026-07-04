---
type: Query Capability
title: "Execute the escalate step in Manhattan Active WM with a full audit trail, and..."
description: "Execute the escalate step in Manhattan Active WM with a full audit trail, and escalate exceptions to the Inventory Control Analyst."
source_id: "act-audit"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the escalate step in Manhattan Active WM with a full audit trail, and escalate exceptions to the Inventory Control Analyst.

## Tools used

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [action_manhattan_active_wm_escalate](/tools/action-manhattan-active-wm-escalate.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Inbound PO ETA Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/inbound-po-eta-monitor-end-to-end.md)

# Citations

- [Inbound PO ETA Monitor Retail Execution Playbook](/documents/inbound-po-eta-monitor-execution-playbook.md)
