---
type: Agent Tool
title: query_zoom_zoom_records
description: Retrieve zoom records from Zoom for the Major Incident Coordinator workflow.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_zoom_zoom_records

Retrieve zoom records from Zoom for the Major Incident Coordinator workflow.

- **Kind:** query
- **Source system:** [Zoom](/systems/zoom.md)

## Inputs

- lookup_key
- date_range

## Outputs

- zoom_records_records
- zoom_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Zoom](/systems/zoom.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [war_room_orchestration](/workflow/war-room-orchestration.md)

## Evals

- [Run the Major Incident Coordinator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/major-incident-coordinator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- zoom_records_records
- zoom_records_summary

# Examples

```
query_zoom_zoom_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Zoom](/systems/zoom.md)
