---
type: Eval Scenario
title: "Billing account BAC-004821 (policy POL-7723190) shows past_due_amount of $842..."
description: "Billing account BAC-004821 (policy POL-7723190) shows past_due_amount of $842.16 and account_status pending_cancel_nonpay, with a next_installment_date of 2026-06-18 already past. The customer called today, 2026-07-04, insisting they mailed a check on 2026-06-25 that BillingCenter hasn't posted. Recommend a payment plan and say whether the account can be saved from cancellation."
source_id: "payment-plan-recommendation-agent-stale-payment-dispute"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Billing account BAC-004821 (policy POL-7723190) shows past_due_amount of $842.16 and account_status pending_cancel_nonpay, with a next_installment_date of 2026-06-18 already past. The customer called today, 2026-07-04, insisting they mailed a check on 2026-06-25 that BillingCenter hasn't posted. Recommend a payment plan and say whether the account can be saved from cancellation.

## Validates

- [account-billing-status-pull](/queries/account-billing-status-pull.md)

## Mechanisms to call

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_payment_plan_recommendation_agent_authority_guide](/tools/lookup-payment-plan-recommendation-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Payment Plan Recommendation Agent Authority & Referral Guide](/documents/payment-plan-recommendation-agent-authority-guide.md)
- [Nonpayment Cancellation Notice & Fee Waiver Rate Manual](/documents/payment-plan-recommendation-agent-nonpay-notice-fee-manual.md)
