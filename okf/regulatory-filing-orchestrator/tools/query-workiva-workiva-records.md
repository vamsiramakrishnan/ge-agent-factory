---
type: Agent Tool
title: query_workiva_workiva_records
description: Retrieve workiva records from Workiva for the Regulatory Filing Orchestrator workflow.
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

# query_workiva_workiva_records

Retrieve workiva records from Workiva for the Regulatory Filing Orchestrator workflow.

- **Kind:** query
- **Source system:** [Workiva](/systems/workiva.md)

## Inputs

- lookup_key
- date_range

## Outputs

- workiva_records_records
- workiva_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Workiva](/systems/workiva.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Regulatory Filing Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-filing-orchestrator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- workiva_records_records
- workiva_records_summary

# Examples

```
query_workiva_workiva_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Workiva](/systems/workiva.md)
