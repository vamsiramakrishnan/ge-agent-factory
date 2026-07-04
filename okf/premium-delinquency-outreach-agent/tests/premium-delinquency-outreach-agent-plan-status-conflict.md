---
type: Eval Scenario
title: "Billing account BA-2024-118837 (policy PL-994102) shows account_status = pend..."
description: "Billing account BA-2024-118837 (policy PL-994102) shows account_status = pending_cancel_nonpay in Guidewire BillingCenter with a past-due amount of $1,840.55, but the linked payment_plans record PLAN-55219 shows plan_status = active with 4 installments_remaining and a next_installment_date of 2026-07-18. Marketing wants to send the final cancellation notice through Salesforce Marketing Cloud today. Should we proceed?"
source_id: "premium-delinquency-outreach-agent-plan-status-conflict"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Billing account BA-2024-118837 (policy PL-994102) shows account_status = pending_cancel_nonpay in Guidewire BillingCenter with a past-due amount of $1,840.55, but the linked payment_plans record PLAN-55219 shows plan_status = active with 4 installments_remaining and a next_installment_date of 2026-07-18. Marketing wants to send the final cancellation notice through Salesforce Marketing Cloud today. Should we proceed?

## Validates

- [cure-probability-scoring](/queries/cure-probability-scoring.md)

## Mechanisms to call

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_premium_delinquency_outreach_agent_authority_guide](/tools/lookup-premium-delinquency-outreach-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Premium Delinquency Outreach Agent Authority & Referral Guide](/documents/premium-delinquency-outreach-agent-authority-guide.md)
- [Nonpayment Cancellation Notice & Dunning Cadence Compliance Playbook](/documents/premium-delinquency-outreach-agent-cancellation-notice-dunning-playbook.md)
