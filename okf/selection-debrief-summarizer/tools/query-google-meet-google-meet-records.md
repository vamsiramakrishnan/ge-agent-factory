---
type: Agent Tool
title: query_google_meet_google_meet_records
description: Retrieve google meet records from Google Meet for the Selection Debrief Summarizer workflow.
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

# query_google_meet_google_meet_records

Retrieve google meet records from Google Meet for the Selection Debrief Summarizer workflow.

- **Kind:** query
- **Source system:** [Google Meet](/systems/google-meet.md)

## Inputs

- lookup_key
- date_range

## Outputs

- google_meet_records_records
- google_meet_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Meet](/systems/google-meet.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [documentation_audit](/workflow/documentation-audit.md)

## Evals

- [Run the Selection Debrief Summarizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/selection-debrief-summarizer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- google_meet_records_records
- google_meet_records_summary

# Examples

```
query_google_meet_google_meet_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Google Meet](/systems/google-meet.md)
