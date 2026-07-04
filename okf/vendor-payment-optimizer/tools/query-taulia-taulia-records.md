---
type: Agent Tool
title: query_taulia_taulia_records
description: Retrieve taulia records from Taulia for the Vendor Payment Optimizer workflow.
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

# query_taulia_taulia_records

Retrieve taulia records from Taulia for the Vendor Payment Optimizer workflow.

- **Kind:** query
- **Source system:** [Taulia](/systems/taulia.md)

## Inputs

- lookup_key
- date_range

## Outputs

- taulia_records_records
- taulia_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Taulia](/systems/taulia.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [payment_cash_aggregation](/workflow/payment-cash-aggregation.md)

## Evals

- [Run the Vendor Payment Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/vendor-payment-optimizer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- taulia_records_records
- taulia_records_summary

# Examples

```
query_taulia_taulia_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Taulia](/systems/taulia.md)
