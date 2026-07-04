---
type: Agent Tool
title: query_emaint_emaint_records
description: "Retrieve emaint records from eMaint for the MRO & Facilities Optimization workflow."
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

# query_emaint_emaint_records

Retrieve emaint records from eMaint for the MRO & Facilities Optimization workflow.

- **Kind:** query
- **Source system:** [eMaint](/systems/emaint.md)

## Inputs

- lookup_key
- date_range

## Outputs

- emaint_records_records
- emaint_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [eMaint](/systems/emaint.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the MRO & Facilities Optimization workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/mro-facilities-optimization-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- emaint_records_records
- emaint_records_summary

# Examples

```
query_emaint_emaint_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [eMaint](/systems/emaint.md)
