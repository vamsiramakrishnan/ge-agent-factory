---
type: Agent Tool
title: query_meeting_logs_meeting_logs_records
description: Retrieve meeting logs records from Meeting Logs for the Relationship Health Analyzer workflow.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_meeting_logs_meeting_logs_records

Retrieve meeting logs records from Meeting Logs for the Relationship Health Analyzer workflow.

- **Kind:** query
- **Source system:** [Meeting Logs](/systems/meeting-logs.md)

## Inputs

- lookup_key
- date_range

## Outputs

- meeting_logs_records_records
- meeting_logs_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Meeting Logs](/systems/meeting-logs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [signal_aggregation](/workflow/signal-aggregation.md)
- [tone_shift_detection_early_warning](/workflow/tone-shift-detection-early-warning.md)

## Evals

- [Run the Relationship Health Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/relationship-health-analyzer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- meeting_logs_records_records
- meeting_logs_records_summary

# Examples

```
query_meeting_logs_meeting_logs_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Meeting Logs](/systems/meeting-logs.md)
