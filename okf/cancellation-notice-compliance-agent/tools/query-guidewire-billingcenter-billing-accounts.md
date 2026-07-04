---
type: Agent Tool
title: query_guidewire_billingcenter_billing_accounts
description: Retrieve billing accounts from Guidewire BillingCenter for the Cancellation Notice Compliance Agent workflow.
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

Retrieve billing accounts from Guidewire BillingCenter for the Cancellation Notice Compliance Agent workflow.

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

- [nonpay_queue_triage](/workflow/nonpay-queue-triage.md)
- [proof_of_mailing_reconciliation_filing](/workflow/proof-of-mailing-reconciliation-filing.md)
- [exception_escalation_compliance_reporting](/workflow/exception-escalation-compliance-reporting.md)

## Evals

- [Run the Cancellation Notice Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cancellation-notice-compliance-agent-end-to-end.md)
- [Billing account BAC-100482 (policy PLC-778821) shows account_status = pending_cancel_nonpay with a past_due_amount of $612.40, but premium_invoices record INV-55931 for that same billing_account_number is marked invoice_status = paid_in_full as of 2026-06-29. Before we cut a cancellation notice, tell me whether this account is still eligible for nonpay cancellation and what the correct statutory notice date is.](/tests/cancellation-notice-compliance-agent-conflicting-status.md)
- [Billing account BAC-203977 (policy PLC-441209, bill_type = mortgagee_bill) enters its statutory nonpay cancellation window today. The lienholder-copy DocuSign envelope ENV-88214 shows recipients status = pending and was created_at 2026-06-02, over 30 days ago with no delivery confirmation. The producer wants the cancellation filed today anyway. What do you do?](/tests/cancellation-notice-compliance-agent-stale-lienholder-evidence.md)

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
