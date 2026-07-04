---
type: Agent Tool
title: query_recognition_platform_recognition_platform_records
description: "Retrieve recognition platform records from Recognition Platform for the Recognition Nudge & Celebration workflow."
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_recognition_platform_recognition_platform_records

Retrieve recognition platform records from Recognition Platform for the Recognition Nudge & Celebration workflow.

- **Kind:** query
- **Source system:** [Recognition Platform](/systems/recognition-platform.md)

## Inputs

- lookup_key
- date_range

## Outputs

- recognition_platform_records_records
- recognition_platform_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Recognition Platform](/systems/recognition-platform.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [event_detection](/workflow/event-detection.md)
- [nudge_generation](/workflow/nudge-generation.md)
- [equity_tracking](/workflow/equity-tracking.md)

## Evals

- [Run the Recognition Nudge & Celebration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/recognition-nudge-celebration-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- recognition_platform_records_records
- recognition_platform_records_summary

# Examples

```
query_recognition_platform_recognition_platform_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Recognition Platform](/systems/recognition-platform.md)
