---
type: Policy
title: Escalation policy 2
description: "When Segregation-of-duties conflict detected (incompatible groups in template); action: refuse"
source_id: "escalation-2"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.1
generation_status: generated
ge_status: generated
---

# Escalation policy 2

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.1

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Segregation-of-duties conflict detected (incompatible groups in template) | refuse |  | Role template violates segregation-of-duties policy; do not provision conflicting access. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
