---
type: Agent Tool
title: query_guidewire_billingcenter_premium_invoices
description: Retrieve premium invoices from Guidewire BillingCenter for the Cancellation Notice Compliance Agent workflow.
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

# query_guidewire_billingcenter_premium_invoices

Retrieve premium invoices from Guidewire BillingCenter for the Cancellation Notice Compliance Agent workflow.

- **Kind:** query
- **Source system:** [Guidewire BillingCenter](/systems/guidewire-billingcenter.md)

## Inputs

- invoice_number
- billing_account_number
- date_range

## Outputs

- premium_invoices_records

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

- [Billing account BAC-100482 (policy PLC-778821) shows account_status = pending_cancel_nonpay with a past_due_amount of $612.40, but premium_invoices record INV-55931 for that same billing_account_number is marked invoice_status = paid_in_full as of 2026-06-29. Before we cut a cancellation notice, tell me whether this account is still eligible for nonpay cancellation and what the correct statutory notice date is.](/tests/cancellation-notice-compliance-agent-conflicting-status.md)

## Evidence emitted

- source_system_record

## Required inputs

- invoice_number
- billing_account_number
- date_range

## Produces

- premium_invoices_records

# Examples

```
query_guidewire_billingcenter_premium_invoices(invoice_number=<invoice_number>, billing_account_number=<billing_account_number>, date_range=<date_range>)
```

# Citations

- [Guidewire BillingCenter](/systems/guidewire-billingcenter.md)
