---
type: Policy
title: Escalation policy 8
description: "When Three or more expedite tickets in the same week cite the same material_number as the reason for the request; action: escalate_to_human; handoff: supply_planning_manager"
source_id: "escalation-8"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.7
generation_status: generated
ge_status: generated
---

# Escalation policy 8

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.7

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Three or more expedite tickets in the same week cite the same material_number as the reason for the request | escalate_to_human | supply_planning_manager | Repeated expedites against one material indicate a recurring supply-plan defect, not a series of one-off shortages, and need a planning fix rather than another individual expedite approval. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
