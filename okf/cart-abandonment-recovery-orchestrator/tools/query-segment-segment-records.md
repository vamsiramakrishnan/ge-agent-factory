---
type: Agent Tool
title: query_segment_segment_records
description: Retrieve segment records from Segment for the Cart Abandonment Recovery Orchestrator workflow.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_segment_segment_records

Retrieve segment records from Segment for the Cart Abandonment Recovery Orchestrator workflow.

- **Kind:** query
- **Source system:** [Segment](/systems/segment.md)

## Inputs

- lookup_key
- date_range

## Outputs

- segment_records_records
- segment_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Segment](/systems/segment.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)

## Evals

- [Run the Cart Abandonment Recovery Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cart-abandonment-recovery-orchestrator-end-to-end.md)

## Evidence emitted

- sql_result

## Required inputs

- lookup_key
- date_range

## Produces

- segment_records_records
- segment_records_summary

# Examples

```
query_segment_segment_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Segment](/systems/segment.md)
