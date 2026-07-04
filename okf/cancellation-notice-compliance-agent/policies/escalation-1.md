---
type: Policy
title: Escalation policy 1
description: "When Statutorily defective cancellation notices regresses past the 3.2% baseline by more than 20%; action: escalate_to_human; handoff: Billing Supervisor"
source_id: "escalation-1"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.0
generation_status: generated
ge_status: generated
---

# Escalation policy 1

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.0

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Statutorily defective cancellation notices regresses past the 3.2% baseline by more than 20% | escalate_to_human | Billing Supervisor | Significant regressions need human judgment before automated remediation runs against production records. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
