---
type: Agent Tool
title: query_guidewire_billingcenter_payment_plans
description: Retrieve payment plans from Guidewire BillingCenter for the Agent Commission Reconciliation Engine workflow.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_guidewire_billingcenter_payment_plans

Retrieve payment plans from Guidewire BillingCenter for the Agent Commission Reconciliation Engine workflow.

- **Kind:** query
- **Source system:** [Guidewire BillingCenter](/systems/guidewire-billingcenter.md)

## Inputs

- plan_id
- billing_account_number
- date_range

## Outputs

- payment_plans_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Guidewire BillingCenter](/systems/guidewire-billingcenter.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- plan_id
- billing_account_number
- date_range

## Produces

- payment_plans_records

# Examples

```
query_guidewire_billingcenter_payment_plans(plan_id=<plan_id>, billing_account_number=<billing_account_number>, date_range=<date_range>)
```

# Citations

- [Guidewire BillingCenter](/systems/guidewire-billingcenter.md)
