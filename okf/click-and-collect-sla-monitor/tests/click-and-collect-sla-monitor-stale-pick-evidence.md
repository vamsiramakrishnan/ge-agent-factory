---
type: Eval Scenario
title: "Order number 483920175 (BOPIS, placed 9:14 AM) has been sitting in 'picking' ..."
description: "Order number 483920175 (BOPIS, placed 9:14 AM) has been sitting in 'picking' status for 3 hours 10 minutes against the 2-hour SLA. The only pick_tasks record we have for it is task_number 4821093 in wave_id 5502, and that snapshot is 29 hours old. Should we escalate this to store leadership or reroute it to a nearby store, and what's the evidence?"
source_id: "click-and-collect-sla-monitor-stale-pick-evidence"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Order number 483920175 (BOPIS, placed 9:14 AM) has been sitting in 'picking' status for 3 hours 10 minutes against the 2-hour SLA. The only pick_tasks record we have for it is task_number 4821093 in wave_id 5502, and that snapshot is 29 hours old. Should we escalate this to store leadership or reroute it to a nearby store, and what's the evidence?

## Validates

- [breach-risk-scoring-against-historical-baselines](/queries/breach-risk-scoring-against-historical-baselines.md)

## Mechanisms to call

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_manhattan_active_wm_pick_tasks](/tools/query-manhattan-active-wm-pick-tasks.md)
- [lookup_click_and_collect_sla_monitor_execution_playbook](/tools/lookup-click-and-collect-sla-monitor-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Click-and-Collect SLA Monitor Retail Execution Playbook](/documents/click-and-collect-sla-monitor-execution-playbook.md)
- [Curbside & BOPIS Fulfillment SLA Service Schedule](/documents/curbside-bopis-sla-service-schedule.md)
