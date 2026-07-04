---
type: Agent Tool
title: query_siemens_opcenter_mes_machine_events
description: "Retrieve machine events from Siemens Opcenter MES for the Unplanned Downtime Root-Cause Agent workflow."
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

# query_siemens_opcenter_mes_machine_events

Retrieve machine events from Siemens Opcenter MES for the Unplanned Downtime Root-Cause Agent workflow.

- **Kind:** query
- **Source system:** [Siemens Opcenter MES](/systems/siemens-opcenter-mes.md)

## Inputs

- asset_number
- date_range

## Outputs

- machine_events_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Siemens Opcenter MES](/systems/siemens-opcenter-mes.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Downtime event #2048731 on asset 148820 is logged in PI as downtime_category=breakdown lasting 187 minutes, but the Opcenter MES machine_event log for that same window (2026-06-30 14:10-14:20) shows only a warning_alarm, not a fault_alarm or e_stop. Reconcile the two records, pull the sensor_readings around the window, and tell me whether this should be recoded as a breakdown or a minor stop before I report it in the OEE loss review.](/tests/unplanned-downtime-root-cause-agent-reason-code-conflict.md)

## Evidence emitted

- source_system_record

## Required inputs

- asset_number
- date_range

## Produces

- machine_events_records

# Examples

```
query_siemens_opcenter_mes_machine_events(asset_number=<asset_number>, date_range=<date_range>)
```

# Citations

- [Siemens Opcenter MES](/systems/siemens-opcenter-mes.md)
