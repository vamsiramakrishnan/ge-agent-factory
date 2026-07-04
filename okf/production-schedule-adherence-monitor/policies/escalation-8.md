---
type: Policy
title: Escalation policy 8
description: "When Two or more process_orders on the same constraint-asset resource are simultaneously phase_status=held with material_stagings.shortage_flag=true; action: request_more_info; handoff: materials_planner"
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
| Two or more process_orders on the same constraint-asset resource are simultaneously phase_status=held with material_stagings.shortage_flag=true | request_more_info | materials_planner | A true shortage and a staging lag require different fixes; recommending a re-sequence before the materials planner confirms which one is happening risks jumping a healthy order past one that will clear within the hour. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
