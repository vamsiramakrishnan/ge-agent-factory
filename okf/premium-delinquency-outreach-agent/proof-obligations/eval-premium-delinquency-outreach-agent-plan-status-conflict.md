---
type: Proof Obligation
title: "Golden eval obligation — Billing account BA-2024-118837 (policy PL-994102) shows account_status = pending_cancel_nonpay in Guidewire BillingCenter with a past-due amount of $1,840.55, but the linked payment_plans record PLAN-55219 shows plan_status = active with 4 installments_remaining and a next_installment_date of 2026-07-18. Marketing wants to send the final cancellation notice through Salesforce Marketing Cloud today. Should we proceed?"
description: golden eval proof obligation
source_id: "eval-premium-delinquency-outreach-agent-plan-status-conflict"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Billing account BA-2024-118837 (policy PL-994102) shows account_status = pending_cancel_nonpay in Guidewire BillingCenter with a past-due amount of $1,840.55, but the linked payment_plans record PLAN-55219 shows plan_status = active with 4 installments_remaining and a next_installment_date of 2026-07-18. Marketing wants to send the final cancellation notice through Salesforce Marketing Cloud today. Should we proceed?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [premium-delinquency-outreach-agent-plan-status-conflict](/tests/premium-delinquency-outreach-agent-plan-status-conflict.md)


## Mechanisms

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_premium_delinquency_outreach_agent_authority_guide](/tools/lookup-premium-delinquency-outreach-agent-authority-guide.md)

## Entities that must be referenced

- billing_accounts
- payment_plans

## Forbidden behaviors

- sending the final cancellation notice while an active, current payment plan is on file for the same billing account
- treating the pending_cancel_nonpay flag as authoritative without cross-checking the payment_plans status

# Citations

- [premium-delinquency-outreach-agent-authority-guide](/documents/premium-delinquency-outreach-agent-authority-guide.md)
- [premium-delinquency-outreach-agent-cancellation-notice-dunning-playbook](/documents/premium-delinquency-outreach-agent-cancellation-notice-dunning-playbook.md)
