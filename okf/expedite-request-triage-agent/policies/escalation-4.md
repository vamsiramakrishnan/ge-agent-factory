---
type: Policy
title: Escalation policy 4
description: "When Projected line-down: material coverage below 24 hours at a constraint work center with staging_status shorted; action: escalate_to_human; handoff: materials_manager"
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
| Projected line-down: material coverage below 24 hours at a constraint work center with staging_status shorted | escalate_to_human | materials_manager | Sub-day coverage at the bottleneck exhausts every automated remedy (alternate stock, transfer orders); premium freight and allocation decisions carry cost authority the agent does not hold. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
