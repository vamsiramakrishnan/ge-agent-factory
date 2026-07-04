---
type: Policy
title: Escalation policy 4
description: "When Contractor employee without endpoint admin policy coverage; action: refuse"
source_id: "escalation-4"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
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
| Contractor employee without endpoint admin policy coverage | refuse |  | Contractors must explicitly opt in to endpoint admin policies; do not auto-provision elevated access. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
