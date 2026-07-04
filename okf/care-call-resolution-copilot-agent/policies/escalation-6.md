---
type: Policy
title: Escalation policy 6
description: "When Third or subsequent contact on the same issue within 7 days without resolution; action: escalate_to_human; handoff: resolution_desk"
source_id: "escalation-6"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.5
generation_status: generated
ge_status: generated
---

# Escalation policy 6

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.5

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Third or subsequent contact on the same issue within 7 days without resolution | escalate_to_human | resolution_desk | Repeat-contact spirals are the strongest pre-churn signal in care data; breaking the loop needs an owner with cross-department authority, not another scripted attempt. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
