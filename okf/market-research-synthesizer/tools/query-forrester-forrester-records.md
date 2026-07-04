---
type: Agent Tool
title: query_forrester_forrester_records
description: Retrieve forrester records from Forrester for the Market Research Synthesizer workflow.
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

# query_forrester_forrester_records

Retrieve forrester records from Forrester for the Market Research Synthesizer workflow.

- **Kind:** query
- **Source system:** [Forrester](/systems/forrester.md)

## Inputs

- lookup_key
- date_range

## Outputs

- forrester_records_records
- forrester_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Forrester](/systems/forrester.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [source_aggregation](/workflow/source-aggregation.md)

## Evals

- [Run the Market Research Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/market-research-synthesizer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- forrester_records_records
- forrester_records_summary

# Examples

```
query_forrester_forrester_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Forrester](/systems/forrester.md)
