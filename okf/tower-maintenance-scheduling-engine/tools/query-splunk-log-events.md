---
type: Agent Tool
title: query_splunk_log_events
description: Retrieve log events from Splunk for the Tower Maintenance Scheduling Engine workflow.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_splunk_log_events

Retrieve log events from Splunk for the Tower Maintenance Scheduling Engine workflow.

- **Kind:** query
- **Source system:** [Splunk](/systems/splunk.md)

## Inputs

- lookup_key
- date_range

## Outputs

- log_events_records
- log_events_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Splunk](/systems/splunk.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [site_alarm_intake](/workflow/site-alarm-intake.md)
- [power_degradation_triage](/workflow/power-degradation-triage.md)

## Evals

- [Run the Tower Maintenance Scheduling Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/tower-maintenance-scheduling-engine-end-to-end.md)
- [Work order 30481022 at premise 4417290 shows wo_status='completed' for site_maintenance (battery/backup power service) dispatched on 2026-06-18, but Splunk shows a new P1 alert_actions record raised on 2026-06-19 for the same tower cabinet, after the work order closed. Before I count this site toward this quarter's preventive maintenance compliance number, tell me whether the fix actually held.](/tests/tower-maintenance-scheduling-engine-completed-wo-open-alarm.md)

## Evidence emitted

- sql_result

## Required inputs

- lookup_key
- date_range

## Produces

- log_events_records
- log_events_summary

# Examples

```
query_splunk_log_events(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Splunk](/systems/splunk.md)
