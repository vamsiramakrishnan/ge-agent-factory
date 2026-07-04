---
type: Agent Tool
title: query_brandfolder_brandfolder_records
description: "Retrieve brandfolder records from Brandfolder for the DAM & Content Lifecycle Manager workflow."
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

# query_brandfolder_brandfolder_records

Retrieve brandfolder records from Brandfolder for the DAM & Content Lifecycle Manager workflow.

- **Kind:** query
- **Source system:** [Brandfolder](/systems/brandfolder.md)

## Inputs

- lookup_key
- date_range

## Outputs

- brandfolder_records_records
- brandfolder_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Brandfolder](/systems/brandfolder.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the DAM & Content Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dam-content-lifecycle-manager-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- brandfolder_records_records
- brandfolder_records_summary

# Examples

```
query_brandfolder_brandfolder_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Brandfolder](/systems/brandfolder.md)
