---
type: Policy
title: Escalation policy 3
description: "When Close task dependencies are missing or incomplete; action: refuse"
source_id: "escalation-3"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.2
generation_status: generated
ge_status: generated
---

# Escalation policy 3

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.2

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Close task dependencies are missing or incomplete | refuse |  | Cannot compute critical-path bottleneck analysis without a complete dependency graph; refuse and cite the close-cycle-playbook.task-definition-requirements section. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
