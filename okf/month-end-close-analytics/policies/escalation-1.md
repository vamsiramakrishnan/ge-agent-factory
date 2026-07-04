---
type: Policy
title: Escalation policy 1
description: "When Bottleneck task has recurred in 3+ consecutive close cycles; action: escalate_to_human; handoff: Controller"
source_id: "escalation-1"
tags:
  - finance
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
| Bottleneck task has recurred in 3+ consecutive close cycles | escalate_to_human | Controller | A recurring bottleneck indicates a systemic issue (staffing, process, tool) that requires management decision-making; the agent recommends escalation with evidence. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
