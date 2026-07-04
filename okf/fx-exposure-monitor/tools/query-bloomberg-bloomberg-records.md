---
type: Agent Tool
title: query_bloomberg_bloomberg_records
description: Retrieve bloomberg records from Bloomberg for the FX Exposure Monitor workflow.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bloomberg_bloomberg_records

Retrieve bloomberg records from Bloomberg for the FX Exposure Monitor workflow.

- **Kind:** query
- **Source system:** [Bloomberg](/systems/bloomberg.md)

## Inputs

- lookup_key
- date_range

## Outputs

- bloomberg_records_records
- bloomberg_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Bloomberg](/systems/bloomberg.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the FX Exposure Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/fx-exposure-monitor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- bloomberg_records_records
- bloomberg_records_summary

# Examples

```
query_bloomberg_bloomberg_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Bloomberg](/systems/bloomberg.md)
