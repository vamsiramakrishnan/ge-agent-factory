---
type: Policy
title: Escalation policy 4
description: "When ECO touches a safety-critical characteristic, a certified/qualified design (e.g., part of a regulatory submission or type certificate), or a customer-frozen interface; action: escalate_to_human; handoff: chief_engineer"
source_id: "escalation-4"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.3
generation_status: generated
ge_status: generated
---

# Escalation policy 4

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.3

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| ECO touches a safety-critical characteristic, a certified/qualified design (e.g., part of a regulatory submission or type certificate), or a customer-frozen interface | escalate_to_human | chief_engineer | Changes inside a certification or qualification envelope can invalidate the approval basis; only the design authority can judge re-qualification scope. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
