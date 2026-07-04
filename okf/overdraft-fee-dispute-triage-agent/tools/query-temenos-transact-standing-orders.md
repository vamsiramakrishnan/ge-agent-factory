---
type: Agent Tool
title: query_temenos_transact_standing_orders
description: Retrieve standing orders from Temenos Transact for the Overdraft Fee Dispute Triage Agent workflow.
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

# query_temenos_transact_standing_orders

Retrieve standing orders from Temenos Transact for the Overdraft Fee Dispute Triage Agent workflow.

- **Kind:** query
- **Source system:** [Temenos Transact](/systems/temenos-transact.md)

## Inputs

- order_reference
- account_number
- date_range

## Outputs

- standing_orders_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Temenos Transact](/systems/temenos-transact.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- order_reference
- account_number
- date_range

## Produces

- standing_orders_records

# Examples

```
query_temenos_transact_standing_orders(order_reference=<order_reference>, account_number=<account_number>, date_range=<date_range>)
```

# Citations

- [Temenos Transact](/systems/temenos-transact.md)
