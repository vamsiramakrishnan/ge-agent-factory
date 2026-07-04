---
type: Agent Tool
title: query_s_p_global_platts_s_p_global_platts_records
description: "Retrieve s p global platts records from S&P Global Platts for the Commodity Price Forecaster workflow."
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

# query_s_p_global_platts_s_p_global_platts_records

Retrieve s p global platts records from S&P Global Platts for the Commodity Price Forecaster workflow.

- **Kind:** query
- **Source system:** [S&P Global Platts](/systems/s-p-global-platts.md)

## Inputs

- lookup_key
- date_range

## Outputs

- s_p_global_platts_records_records
- s_p_global_platts_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [S&P Global Platts](/systems/s-p-global-platts.md).

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

- s_p_global_platts_records_records
- s_p_global_platts_records_summary

# Examples

```
query_s_p_global_platts_s_p_global_platts_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [S&P Global Platts](/systems/s-p-global-platts.md)
