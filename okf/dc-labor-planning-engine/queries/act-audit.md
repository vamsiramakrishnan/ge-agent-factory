---
type: Query Capability
title: "Execute the generate step in Manhattan Active WM with a full audit trail, and..."
description: "Execute the generate step in Manhattan Active WM with a full audit trail, and escalate exceptions to the DC Operations Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the generate step in Manhattan Active WM with a full audit trail, and escalate exceptions to the DC Operations Manager.

## Tools used

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [action_manhattan_active_wm_generate](/tools/action-manhattan-active-wm-generate.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the DC Labor Planning Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dc-labor-planning-engine-end-to-end.md)

# Citations

- [DC Labor Planning Engine Retail Execution Playbook](/documents/dc-labor-planning-engine-execution-playbook.md)
