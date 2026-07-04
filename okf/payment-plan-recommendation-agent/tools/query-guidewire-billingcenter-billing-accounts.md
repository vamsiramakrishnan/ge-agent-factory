---
type: Agent Tool
title: query_guidewire_billingcenter_billing_accounts
description: Retrieve billing accounts from Guidewire BillingCenter for the Payment Plan Recommendation Agent workflow.
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

Retrieve billing accounts from Guidewire BillingCenter for the Payment Plan Recommendation Agent workflow.

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

- [account_billing_status_pull](/workflow/account-billing-status-pull.md)
- [plan_option_re_rating_ranking](/workflow/plan-option-re-rating-ranking.md)
- [plan_application_interaction_logging](/workflow/plan-application-interaction-logging.md)

## Evals

- [Run the Payment Plan Recommendation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/payment-plan-recommendation-agent-end-to-end.md)
- [Billing account BAC-004821 (policy POL-7723190) shows past_due_amount of $842.16 and account_status pending_cancel_nonpay, with a next_installment_date of 2026-06-18 already past. The customer called today, 2026-07-04, insisting they mailed a check on 2026-06-25 that BillingCenter hasn't posted. Recommend a payment plan and say whether the account can be saved from cancellation.](/tests/payment-plan-recommendation-agent-stale-payment-dispute.md)
- [Billing account BAC-011932 (policy POL-8804417) has nsf_returns_last_12mo = 2, current_balance of $6,140.00, and autopay_eft_enrolled = false. The policyholder is requesting the ten_pay plan with an 8.33% down_payment_pct and wants the $10 per-installment fee waived on all ten installments. Determine whether this is within your recommendation authority and present the plan.](/tests/payment-plan-recommendation-agent-nsf-fee-waiver-edge.md)

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
