---
type: Policy
title: Escalation policy 7
description: "When The same unsafe condition or hazard type appears in safety_incidents observation clusters across 3 or more distinct area/shift combinations within a rolling 7-day window; action: escalate_to_human; handoff: Area Operations Manager"
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
| The same unsafe condition or hazard type appears in safety_incidents observation clusters across 3 or more distinct area/shift combinations within a rolling 7-day window | escalate_to_human | Area Operations Manager | Cross-area, cross-shift recurrence indicates a systemic condition (equipment, procedure, or training gap) that a single-area toolbox talk cannot fix and that warrants a management-of-change review before the cluster is closed out. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
