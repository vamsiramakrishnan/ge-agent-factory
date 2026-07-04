---
type: Policy
title: Escalation policy 7
description: "When guarantor_strength is recorded as 'unsupported' or 'marginal' on a credit_memos record while requested_amount on the linked loan_applications exceeds $2,000,000; action: escalate_to_human; handoff: senior_credit_officer"
source_id: "escalation-7"
tags:
  - banking
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
| guarantor_strength is recorded as 'unsupported' or 'marginal' on a credit_memos record while requested_amount on the linked loan_applications exceeds $2,000,000 | escalate_to_human | senior_credit_officer | Weak guarantor support on larger exposures requires senior credit officer confirmation of a secondary repayment source before the memo advances to committee. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
