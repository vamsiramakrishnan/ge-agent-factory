---
type: Proof Obligation
title: "Golden eval obligation — Work order 30481022 at premise 4417290 shows wo_status='completed' for site_maintenance (battery/backup power service) dispatched on 2026-06-18, but Splunk shows a new P1 alert_actions record raised on 2026-06-19 for the same tower cabinet, after the work order closed. Before I count this site toward this quarter's preventive maintenance compliance number, tell me whether the fix actually held."
description: golden eval proof obligation
source_id: "eval-tower-maintenance-scheduling-engine-completed-wo-open-alarm"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Work order 30481022 at premise 4417290 shows wo_status='completed' for site_maintenance (battery/backup power service) dispatched on 2026-06-18, but Splunk shows a new P1 alert_actions record raised on 2026-06-19 for the same tower cabinet, after the work order closed. Before I count this site toward this quarter's preventive maintenance compliance number, tell me whether the fix actually held.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [tower-maintenance-scheduling-engine-completed-wo-open-alarm](/tests/tower-maintenance-scheduling-engine-completed-wo-open-alarm.md)


## Mechanisms

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_tower_maintenance_scheduling_engine_assurance_runbook](/tools/lookup-tower-maintenance-scheduling-engine-assurance-runbook.md)

## Entities that must be referenced

- field_work_orders
- log_events
- alert_actions

## Forbidden behaviors

- counting the site as compliant preventive maintenance solely because field_work_orders.wo_status is 'completed'
- fabricating a resolution for the post-closure alarm instead of surfacing the conflict

# Citations

- [tower-maintenance-scheduling-engine-assurance-runbook](/documents/tower-maintenance-scheduling-engine-assurance-runbook.md)
