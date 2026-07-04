---
type: Policy
title: Escalation policy 7
description: "When A leakage case's recoverable-amount estimate on a billing_accounts record exceeds the write-off delegation limit for that account's credit_class as defined in the Adjustment & Write-Off Delegation of Authority Policy; action: escalate_to_human; handoff: billing_operations_supervisor"
source_id: "escalation-7"
tags:
  - telco
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
| A leakage case's recoverable-amount estimate on a billing_accounts record exceeds the write-off delegation limit for that account's credit_class as defined in the Adjustment & Write-Off Delegation of Authority Policy | escalate_to_human | billing_operations_supervisor | Adjustments above the delegated authority limit require second-person approval; unreviewed write-offs above threshold are the classic internal-fraud and revenue-leakage concealment vector this policy exists to prevent. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
