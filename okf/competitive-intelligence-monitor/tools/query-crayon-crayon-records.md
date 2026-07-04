---
type: Agent Tool
title: query_crayon_crayon_records
description: Retrieve crayon records from Crayon for the Competitive Intelligence Monitor workflow.
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

# query_crayon_crayon_records

Retrieve crayon records from Crayon for the Competitive Intelligence Monitor workflow.

- **Kind:** query
- **Source system:** [Crayon](/systems/crayon.md)

## Inputs

- lookup_key
- date_range

## Outputs

- crayon_records_records
- crayon_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Crayon](/systems/crayon.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Competitive Intelligence Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/competitive-intelligence-monitor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- crayon_records_records
- crayon_records_summary

# Examples

```
query_crayon_crayon_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Crayon](/systems/crayon.md)
