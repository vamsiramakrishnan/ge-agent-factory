---
type: Policy
title: Escalation policy 8
description: "When the DSCR recorded in loan_applications differs from the debt-service coverage implied by the linked credit_memos.global_cash_flow figure by more than 15% for the same application_number; action: request_more_info; handoff: Commercial Credit Analyst"
source_id: "escalation-8"
tags:
  - banking
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
| the DSCR recorded in loan_applications differs from the debt-service coverage implied by the linked credit_memos.global_cash_flow figure by more than 15% for the same application_number | request_more_info | Commercial Credit Analyst | A material mismatch between application-level DSCR and global cash flow spreading indicates a spreading error or unreconciled affiliate cash flows that must be resolved before the ratio is published in committee materials. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
