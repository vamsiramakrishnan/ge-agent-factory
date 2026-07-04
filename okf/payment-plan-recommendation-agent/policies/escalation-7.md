---
type: Policy
title: Escalation policy 7
description: "When Account status is pending_cancel_nonpay and nsf_returns_last_12mo is 2 or more; action: escalate_to_human; handoff: Billing supervisor"
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
| Account status is pending_cancel_nonpay and nsf_returns_last_12mo is 2 or more | escalate_to_human | Billing supervisor | Repeated NSF returns combined with an active cancellation countdown signal a high probability of another default; a supervisor must approve any new installment accommodation before the notice period lapses. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
