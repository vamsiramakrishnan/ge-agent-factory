---
type: Policy
title: Escalation policy 1
description: "When Elevated access requested (requires_manager_approval=true); action: escalate_to_human; handoff: Employee's manager"
source_id: "escalation-1"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
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
| Elevated access requested (requires_manager_approval=true) | escalate_to_human | Employee's manager | Elevated access must be approved by the employee's direct manager per company policy before provisioning. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
