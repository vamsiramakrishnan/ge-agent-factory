---
type: Agent Tool
title: query_6sense_6sense_records
description: "Retrieve 6sense records from 6sense for the Lead Scoring & Qualification Agent workflow."
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

# query_6sense_6sense_records

Retrieve 6sense records from 6sense for the Lead Scoring & Qualification Agent workflow.

- **Kind:** query
- **Source system:** [6sense](/systems/6sense.md)

## Inputs

- lookup_key
- date_range

## Outputs

- 6sense_records_records
- 6sense_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [6sense](/systems/6sense.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [signal_collection](/workflow/signal-collection.md)

## Evals

- [Run the Lead Scoring & Qualification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/lead-scoring-qualification-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- 6sense_records_records
- 6sense_records_summary

# Examples

```
query_6sense_6sense_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [6sense](/systems/6sense.md)
