---
type: Agent Tool
title: query_hackett_hackett_records
description: Retrieve hackett records from Hackett for the Benchmark Intelligence Agent workflow.
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

# query_hackett_hackett_records

Retrieve hackett records from Hackett for the Benchmark Intelligence Agent workflow.

- **Kind:** query
- **Source system:** [Hackett](/systems/hackett.md)

## Inputs

- lookup_key
- date_range

## Outputs

- hackett_records_records
- hackett_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Hackett](/systems/hackett.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [benchmark_data_retrieval](/workflow/benchmark-data-retrieval.md)

## Evals

- [Run the Benchmark Intelligence Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/benchmark-intelligence-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- hackett_records_records
- hackett_records_summary

# Examples

```
query_hackett_hackett_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Hackett](/systems/hackett.md)
