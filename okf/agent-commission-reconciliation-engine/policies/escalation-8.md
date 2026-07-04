---
type: Policy
title: Escalation policy 8
description: "When The commission rate applied in premium_invoices disagrees with the agency agreement's contracted rate tier on three or more installments for the same billing_account_number; action: request_more_info; handoff: Agency relationship manager"
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
| The commission rate applied in premium_invoices disagrees with the agency agreement's contracted rate tier on three or more installments for the same billing_account_number | request_more_info | Agency relationship manager | A repeating rate mismatch usually signals an unbooked contract amendment rather than a one-off billing error, and must be confirmed against the agency file before any statement correction is issued. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
