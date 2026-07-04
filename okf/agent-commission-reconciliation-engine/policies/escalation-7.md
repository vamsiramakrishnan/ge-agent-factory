---
type: Policy
title: Escalation policy 7
description: "When A single agency's cumulative commission overpayment recovery for the statement period exceeds $15,000 across its billing_accounts; action: escalate_to_human; handoff: Premium accounting supervisor"
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
| A single agency's cumulative commission overpayment recovery for the statement period exceeds $15,000 across its billing_accounts | escalate_to_human | Premium accounting supervisor | Recoveries at this size require dual sign-off and carry agency-relationship risk if clawed back without supervisor review, consistent with the carrier's financial controls. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
