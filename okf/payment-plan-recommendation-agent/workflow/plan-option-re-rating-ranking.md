---
type: Workflow Stage
title: "Plan Option Re-Rating & Ranking"
description: "Re-rate candidate payment_plans (two_pay_50_50, four_pay_quarterly, ten_pay, monthly_eft_12_pay) against the billing_account's current_balance and past_due_amount in Guidewire BillingCenter to build a ranked, affordable set of options."
source_id: plan_option_re_rating_ranking
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Plan Option Re-Rating & Ranking

Re-rate candidate payment_plans (two_pay_50_50, four_pay_quarterly, ten_pay, monthly_eft_12_pay) against the billing_account's current_balance and past_due_amount in Guidewire BillingCenter to build a ranked, affordable set of options.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [lookup_payment_plan_recommendation_agent_authority_guide](/tools/lookup-payment-plan-recommendation-agent-authority-guide.md)
- [action_guidewire_billingcenter_approve](/tools/action-guidewire-billingcenter-approve.md)

Next: [Authority & Notice-Period Gate](/workflow/authority-notice-period-gate.md)
