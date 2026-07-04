---
type: Agent Tool
title: query_google_calendar_events
description: Retrieve events from Google Calendar for the Campaign Calendar Orchestrator workflow.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_google_calendar_events

Retrieve events from Google Calendar for the Campaign Calendar Orchestrator workflow.

- **Kind:** query
- **Source system:** [Google Calendar](/systems/google-calendar.md)

## Inputs

- lookup_key
- date_range

## Outputs

- events_records
- events_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Calendar](/systems/google-calendar.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [calendar_synchronization](/workflow/calendar-synchronization.md)

## Evals

- [Run the Campaign Calendar Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/campaign-calendar-orchestrator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- events_records
- events_summary

# Examples

```
query_google_calendar_events(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Google Calendar](/systems/google-calendar.md)
