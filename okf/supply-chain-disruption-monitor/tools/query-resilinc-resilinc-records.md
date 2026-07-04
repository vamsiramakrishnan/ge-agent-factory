---
type: Agent Tool
title: query_resilinc_resilinc_records
description: Retrieve resilinc records from Resilinc for the Supply Chain Disruption Monitor workflow.
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

# query_resilinc_resilinc_records

Retrieve resilinc records from Resilinc for the Supply Chain Disruption Monitor workflow.

- **Kind:** query
- **Source system:** [Resilinc](/systems/resilinc.md)

## Inputs

- lookup_key
- date_range

## Outputs

- resilinc_records_records
- resilinc_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Resilinc](/systems/resilinc.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [continuous_signal_ingestion](/workflow/continuous-signal-ingestion.md)

## Evals

- [Run the Supply Chain Disruption Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supply-chain-disruption-monitor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- resilinc_records_records
- resilinc_records_summary

# Examples

```
query_resilinc_resilinc_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Resilinc](/systems/resilinc.md)
