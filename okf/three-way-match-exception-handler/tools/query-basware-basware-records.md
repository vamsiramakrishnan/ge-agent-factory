---
type: Agent Tool
title: query_basware_basware_records
description: "Retrieve basware records from Basware for the Three-Way Match Exception Handler workflow."
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

# query_basware_basware_records

Retrieve basware records from Basware for the Three-Way Match Exception Handler workflow.

- **Kind:** query
- **Source system:** [Basware](/systems/basware.md)

## Inputs

- lookup_key
- date_range

## Outputs

- basware_records_records
- basware_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Basware](/systems/basware.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Three-Way Match Exception Handler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/three-way-match-exception-handler-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- basware_records_records
- basware_records_summary

# Examples

```
query_basware_basware_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Basware](/systems/basware.md)
