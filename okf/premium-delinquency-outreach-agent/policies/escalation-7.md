---
type: Policy
title: Escalation policy 7
description: "When billing_accounts.account_status reads pending_cancel_nonpay while the linked payment_plans record for that billing_account_number reads plan_status = active with installments_remaining > 0; action: request_more_info; handoff: Billing Operations Analyst"
source_id: "escalation-7"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.6
generation_status: generated
ge_status: generated
---

# Escalation policy 7

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.6

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| billing_accounts.account_status reads pending_cancel_nonpay while the linked payment_plans record for that billing_account_number reads plan_status = active with installments_remaining > 0 | request_more_info | Billing Operations Analyst | BillingCenter's account and installment-plan tables disagree; a human must reconcile the conflict before any cancellation notice references a policyholder who is current on an approved payment plan. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
