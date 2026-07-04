---
type: Workflow Stage
title: "Publish, Audit & Notify"
description: "Execute action_manhattan_active_wm_generate to publish the shift plan in Manhattan Active WM with a generated_audit_trail entry, and notify the DC Operations Manager of remaining capacity gaps and flex-labor options."
source_id: publish_audit_notify
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Publish, Audit & Notify

Execute action_manhattan_active_wm_generate to publish the shift plan in Manhattan Active WM with a generated_audit_trail entry, and notify the DC Operations Manager of remaining capacity gaps and flex-labor options.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [lookup_dc_labor_planning_engine_execution_playbook](/tools/lookup-dc-labor-planning-engine-execution-playbook.md)
- [action_manhattan_active_wm_generate](/tools/action-manhattan-active-wm-generate.md)
