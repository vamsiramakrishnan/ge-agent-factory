---
type: Query Capability
title: "Correlate each order against its Manhattan Active WM pick_tasks record -- pic..."
description: "Correlate each order against its Manhattan Active WM pick_tasks record -- pick_status, cases_per_hour, wave_id, and pick_zone -- via query_manhattan_active_wm_pick_tasks and query_manhattan_active_wm_warehouse_orders to see where the pick actually stands."
source_id: "pick-task-telemetry-correlation"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Correlate each order against its Manhattan Active WM pick_tasks record -- pick_status, cases_per_hour, wave_id, and pick_zone -- via query_manhattan_active_wm_pick_tasks and query_manhattan_active_wm_warehouse_orders to see where the pick actually stands.

## Tools used

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)

## Runs in

- [pick_task_telemetry_correlation](/workflow/pick-task-telemetry-correlation.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Click-and-Collect SLA Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/click-and-collect-sla-monitor-end-to-end.md)
- [Order number 483920175 (BOPIS, placed 9:14 AM) has been sitting in 'picking' status for 3 hours 10 minutes against the 2-hour SLA. The only pick_tasks record we have for it is task_number 4821093 in wave_id 5502, and that snapshot is 29 hours old. Should we escalate this to store leadership or reroute it to a nearby store, and what's the evidence?](/tests/click-and-collect-sla-monitor-stale-pick-evidence.md)

# Citations

- [Click-and-Collect SLA Monitor Retail Execution Playbook](/documents/click-and-collect-sla-monitor-execution-playbook.md)
- [Curbside & BOPIS Fulfillment SLA Service Schedule](/documents/curbside-bopis-sla-service-schedule.md)
