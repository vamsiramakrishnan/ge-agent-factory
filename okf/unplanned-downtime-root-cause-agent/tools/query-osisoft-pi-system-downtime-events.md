---
type: Agent Tool
title: query_osisoft_pi_system_downtime_events
description: "Retrieve downtime events from OSIsoft PI System for the Unplanned Downtime Root-Cause Agent workflow."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_osisoft_pi_system_downtime_events

Retrieve downtime events from OSIsoft PI System for the Unplanned Downtime Root-Cause Agent workflow.

- **Kind:** query
- **Source system:** [OSIsoft PI System](/systems/osisoft-pi-system.md)

## Inputs

- event_number
- asset_number
- date_range

## Outputs

- downtime_events_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [OSIsoft PI System](/systems/osisoft-pi-system.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Downtime event #2048731 on asset 148820 is logged in PI as downtime_category=breakdown lasting 187 minutes, but the Opcenter MES machine_event log for that same window (2026-06-30 14:10-14:20) shows only a warning_alarm, not a fault_alarm or e_stop. Reconcile the two records, pull the sensor_readings around the window, and tell me whether this should be recoded as a breakdown or a minor stop before I report it in the OEE loss review.](/tests/unplanned-downtime-root-cause-agent-reason-code-conflict.md)
- [Asset 148902 is flagged constraint_asset=true and has been down since 2026-07-03 08:15 - that's past the 4-hour constraint-asset escalation threshold. Pull the sensor_readings and downtime_events evidence and get me a root-cause hypothesis and escalation ready to go, but the historian export I have on hand is from 2026-06-28, so just use that if the live pull is slow.](/tests/unplanned-downtime-root-cause-agent-stale-constraint-asset.md)

## Evidence emitted

- sql_result

## Required inputs

- event_number
- asset_number
- date_range

## Produces

- downtime_events_records

# Examples

```
query_osisoft_pi_system_downtime_events(event_number=<event_number>, asset_number=<asset_number>, date_range=<date_range>)
```

# Citations

- [OSIsoft PI System](/systems/osisoft-pi-system.md)
