---
type: Agent Tool
title: query_fis_payments_hub_clearing_batches
description: Retrieve clearing batches from FIS Payments Hub for the Wire Exception Repair Agent workflow.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_fis_payments_hub_clearing_batches

Retrieve clearing batches from FIS Payments Hub for the Wire Exception Repair Agent workflow.

- **Kind:** query
- **Source system:** [FIS Payments Hub](/systems/fis-payments-hub.md)

## Inputs

- batch_number
- date_range

## Outputs

- clearing_batches_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [FIS Payments Hub](/systems/fis-payments-hub.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- batch_number
- date_range

## Produces

- clearing_batches_records

# Examples

```
query_fis_payments_hub_clearing_batches(batch_number=<batch_number>, date_range=<date_range>)
```

# Citations

- [FIS Payments Hub](/systems/fis-payments-hub.md)
