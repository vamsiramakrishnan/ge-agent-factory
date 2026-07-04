---
type: Agent Tool
title: query_it_2_it_2_records
description: Retrieve it 2 records from IT 2 for the Feature Store Manager workflow.
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

# query_it_2_it_2_records

Retrieve it 2 records from IT 2 for the Feature Store Manager workflow.

- **Kind:** query
- **Source system:** [IT 2](/systems/it-2.md)

## Inputs

- lookup_key
- date_range

## Outputs

- it_2_records_records
- it_2_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [IT 2](/systems/it-2.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Feature Store Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/feature-store-manager-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- it_2_records_records
- it_2_records_summary

# Examples

```
query_it_2_it_2_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [IT 2](/systems/it-2.md)
