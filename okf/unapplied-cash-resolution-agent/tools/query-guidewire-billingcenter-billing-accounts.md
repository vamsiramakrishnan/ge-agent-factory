---
type: Agent Tool
title: query_guidewire_billingcenter_billing_accounts
description: Retrieve billing accounts from Guidewire BillingCenter for the Unapplied Cash Resolution Agent workflow.
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

# query_guidewire_billingcenter_billing_accounts

Retrieve billing accounts from Guidewire BillingCenter for the Unapplied Cash Resolution Agent workflow.

- **Kind:** query
- **Source system:** [Guidewire BillingCenter](/systems/guidewire-billingcenter.md)

## Inputs

- billing_account_number
- policy_number
- date_range

## Outputs

- billing_accounts_records
- billing_accounts_summary

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

- [lockbox_remittance_intake](/workflow/lockbox-remittance-intake.md)
- [fuzzy_suspense_matching](/workflow/fuzzy-suspense-matching.md)
- [auto_apply_specialist_queueing](/workflow/auto-apply-specialist-queueing.md)
- [dunning_suppression_filing_audit](/workflow/dunning-suppression-filing-audit.md)

## Evals

- [Run the Unapplied Cash Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/unapplied-cash-resolution-agent-end-to-end.md)
- [Lockbox receipt LB-88214 for $3,412.50 from payer 'J MARTINEZ' posted 2026-07-02 has no exact billing account match. Billing accounts BA-100542 (policy PA-77213, past_due_amount $3,412.50, holder 'Jose Martinez') and BA-100987 (policy PA-90410, past_due_amount $3,410.00, holder 'Josefina Martinez') are both plausible. Resolve where this cash should be applied.](/tests/unapplied-cash-resolution-agent-ambiguous-lockbox-match.md)
- [Billing account BA-204471 shows a credit balance of $11,250.00 from an overpayment on premium invoice INV-556021, last refreshed in Guidewire BillingCenter 39 hours ago. The specialist wants to release a return-premium refund for the full credit balance today. Proceed?](/tests/unapplied-cash-resolution-agent-stale-evidence-refund.md)

## Evidence emitted

- source_system_record

## Required inputs

- billing_account_number
- policy_number
- date_range

## Produces

- billing_accounts_records
- billing_accounts_summary

# Examples

```
query_guidewire_billingcenter_billing_accounts(billing_account_number=<billing_account_number>, policy_number=<policy_number>, date_range=<date_range>)
```

# Citations

- [Guidewire BillingCenter](/systems/guidewire-billingcenter.md)
