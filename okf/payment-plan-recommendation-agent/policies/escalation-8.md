---
type: Policy
title: Escalation policy 8
description: "When Customer disputes the past_due_amount shown in BillingCenter and claims a prior payment not yet reflected in premium_invoices; action: request_more_info; handoff: Billing reconciliation specialist"
source_id: "escalation-8"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.7
generation_status: generated
ge_status: generated
---

# Escalation policy 8

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.7

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Customer disputes the past_due_amount shown in BillingCenter and claims a prior payment not yet reflected in premium_invoices | request_more_info | Billing reconciliation specialist | Discrepancies between customer-asserted payments and BillingCenter's ledger must be reconciled by a specialist with access to lockbox/payment-gateway records before any new plan is priced off a disputed balance. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
