---
type: Agent Tool
title: query_lms_lms_records
description: Retrieve lms records from LMS for the Compliance Training Content Generator workflow.
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

# query_lms_lms_records

Retrieve lms records from LMS for the Compliance Training Content Generator workflow.

- **Kind:** query
- **Source system:** [LMS](/systems/lms.md)

## Inputs

- lookup_key
- date_range

## Outputs

- lms_records_records
- lms_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [LMS](/systems/lms.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [publishing_tracking](/workflow/publishing-tracking.md)

## Evals

- [Run the Compliance Training Content Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/compliance-training-content-generator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- lms_records_records
- lms_records_summary

# Examples

```
query_lms_lms_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [LMS](/systems/lms.md)
