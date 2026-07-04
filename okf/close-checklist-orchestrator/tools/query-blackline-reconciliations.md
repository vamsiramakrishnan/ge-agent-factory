---
type: Agent Tool
title: query_blackline_reconciliations
description: Retrieve reconciliations from BlackLine for the Close Checklist Orchestrator workflow.
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

# query_blackline_reconciliations

Retrieve reconciliations from BlackLine for the Close Checklist Orchestrator workflow.

- **Kind:** query
- **Source system:** [BlackLine](/systems/blackline.md)
- **API:** POST /api/blackline/escalate

## Inputs

- lookup_key
- date_range

## Outputs

- reconciliations_records
- reconciliations_summary

## Side Effects

- May change BlackLine state because the spec classifies it as query.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — query_blackline_reconciliations](/policies/confirmation-query-blackline-reconciliations.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [BlackLine](/systems/blackline.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Close Checklist Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/close-checklist-orchestrator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- reconciliations_records
- reconciliations_summary

# Examples

```
query_blackline_reconciliations(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [BlackLine](/systems/blackline.md)
- [Confirmation policy — query_blackline_reconciliations](/policies/confirmation-query-blackline-reconciliations.md)
- [Idempotency policy — query_blackline_reconciliations](/policies/idempotency-query-blackline-reconciliations.md)
