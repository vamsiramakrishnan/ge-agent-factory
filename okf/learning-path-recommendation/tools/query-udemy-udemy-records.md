---
type: Agent Tool
title: query_udemy_udemy_records
description: Retrieve udemy records from Udemy for the Learning Path Recommendation workflow.
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

# query_udemy_udemy_records

Retrieve udemy records from Udemy for the Learning Path Recommendation workflow.

- **Kind:** query
- **Source system:** [Udemy](/systems/udemy.md)

## Inputs

- lookup_key
- date_range

## Outputs

- udemy_records_records
- udemy_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Udemy](/systems/udemy.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Learning Path Recommendation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/learning-path-recommendation-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- udemy_records_records
- udemy_records_summary

# Examples

```
query_udemy_udemy_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Udemy](/systems/udemy.md)
