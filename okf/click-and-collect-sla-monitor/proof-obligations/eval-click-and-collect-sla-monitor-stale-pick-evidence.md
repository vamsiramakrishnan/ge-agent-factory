---
type: Proof Obligation
title: "Golden eval obligation — Order number 483920175 (BOPIS, placed 9:14 AM) has been sitting in 'picking' status for 3 hours 10 minutes against the 2-hour SLA. The only pick_tasks record we have for it is task_number 4821093 in wave_id 5502, and that snapshot is 29 hours old. Should we escalate this to store leadership or reroute it to a nearby store, and what's the evidence?"
description: golden eval proof obligation
source_id: "eval-click-and-collect-sla-monitor-stale-pick-evidence"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Order number 483920175 (BOPIS, placed 9:14 AM) has been sitting in 'picking' status for 3 hours 10 minutes against the 2-hour SLA. The only pick_tasks record we have for it is task_number 4821093 in wave_id 5502, and that snapshot is 29 hours old. Should we escalate this to store leadership or reroute it to a nearby store, and what's the evidence?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [click-and-collect-sla-monitor-stale-pick-evidence](/tests/click-and-collect-sla-monitor-stale-pick-evidence.md)


## Mechanisms

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_manhattan_active_wm_pick_tasks](/tools/query-manhattan-active-wm-pick-tasks.md)
- [lookup_click_and_collect_sla_monitor_execution_playbook](/tools/lookup-click-and-collect-sla-monitor-execution-playbook.md)

## Entities that must be referenced

- online_orders
- pick_tasks

## Forbidden behaviors

- calling action_salesforce_commerce_cloud_escalate based on the 29-hour-old pick_tasks record alone
- fabricating a current pick_status for order 483920175 when the underlying record is stale

# Citations

- [click-and-collect-sla-monitor-execution-playbook](/documents/click-and-collect-sla-monitor-execution-playbook.md)
- [curbside-bopis-sla-service-schedule](/documents/curbside-bopis-sla-service-schedule.md)
