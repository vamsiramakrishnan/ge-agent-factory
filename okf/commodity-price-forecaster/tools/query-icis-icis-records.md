---
type: Agent Tool
title: query_icis_icis_records
description: Retrieve icis records from ICIS for the Commodity Price Forecaster workflow.
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

# query_icis_icis_records

Retrieve icis records from ICIS for the Commodity Price Forecaster workflow.

- **Kind:** query
- **Source system:** [ICIS](/systems/icis.md)

## Inputs

- lookup_key
- date_range

## Outputs

- icis_records_records
- icis_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [ICIS](/systems/icis.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Commodity Price Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/commodity-price-forecaster-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- icis_records_records
- icis_records_summary

# Examples

```
query_icis_icis_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [ICIS](/systems/icis.md)
