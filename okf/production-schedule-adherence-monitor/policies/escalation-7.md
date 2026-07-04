---
type: Policy
title: Escalation policy 7
description: "When Recommended re-sequencing option requires expedite freight spend exceeding $50,000 for a single process_order; action: escalate_to_human; handoff: production_manager"
source_id: "escalation-7"
tags:
  - manufacturing
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
| Recommended re-sequencing option requires expedite freight spend exceeding $50,000 for a single process_order | escalate_to_human | production_manager | Expedite spend at this level sits outside the scheduler's freight authorization band in the Re-Sequencing Work Instruction and needs budget sign-off before it is committed. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
