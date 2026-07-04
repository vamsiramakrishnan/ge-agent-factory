---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query billing_accounts, premium_invoices, and payment_plans from Guidewire BillingCenter and correlate open tickets/macros in Zendesk to establish current_balance, past_due_amount, and account_status before any plan is proposed.](/queries/account-billing-status-pull.md)
- [Compare nsf_returns_last_12mo, autopay_eft_enrolled, and last_payment_date against BigQuery historical_metrics and analytics_events baselines to score default risk and prioritize the rep's queue.](/queries/payment-history-default-risk-scoring.md)
- [Re-rate candidate payment_plans (two_pay_50_50, four_pay_quarterly, ten_pay, monthly_eft_12_pay) against the billing_account's current_balance and past_due_amount in Guidewire BillingCenter to build a ranked, affordable set of options.](/queries/plan-option-re-rating-ranking.md)
- [Cross-check the ranked plan, any fee waiver, and due-date shift against the Payment Plan Recommendation Agent Authority & Referral Guide and the Nonpay Notice & Fee Waiver Rate Manual before committing to a recommendation.](/queries/authority-notice-period-gate.md)
- [Execute action_guidewire_billingcenter_approve to apply the selected payment_plans record in Guidewire BillingCenter and log the full interaction summary to a Zendesk ticket/macro with satisfaction_scores capture.](/queries/plan-application-interaction-logging.md)
