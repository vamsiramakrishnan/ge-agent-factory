---
type: Policy
title: Escalation policy 8
description: "When Two or more covenant_records for the same application_number test in_compliance while the borrower's credit_memo shows policy_exception_count of 3 or more or guarantor_strength of unsupported; action: escalate_to_human; handoff: Senior Credit Officer"
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
| Two or more covenant_records for the same application_number test in_compliance while the borrower's credit_memo shows policy_exception_count of 3 or more or guarantor_strength of unsupported | escalate_to_human | Senior Credit Officer | Passing covenant math can mask underlying credit deterioration already flagged at underwriting; the discrepancy needs risk-rating review, not automatic pass-through. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
