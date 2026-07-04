---
type: Policy
title: Escalation policy 8
description: "When premium_invoices shows invoice_status of paid_in_full or written_off for an account whose billing_accounts.account_status still reads pending_cancel_nonpay; action: request_more_info"
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
| premium_invoices shows invoice_status of paid_in_full or written_off for an account whose billing_accounts.account_status still reads pending_cancel_nonpay | request_more_info |  | Conflicting payment and cancellation-status signals across Guidewire BillingCenter entities must be reconciled with a fresh query before any notice is generated, to avoid cancelling a paid account. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
