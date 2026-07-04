---
type: Policy
title: Escalation policy 7
description: "When A material_stagings record shows shortage_flag = true and staging_status = 'shorted' while the linked bom_revisions used to plan it is one or more revision_level letters behind the currently released structure; action: escalate_to_human; handoff: production_planner"
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
| A material_stagings record shows shortage_flag = true and staging_status = 'shorted' while the linked bom_revisions used to plan it is one or more revision_level letters behind the currently released structure | escalate_to_human | production_planner | A shortage against a stale BOM revision means the wrong component mix was planned; MRP must be re-run against the released structure before staging resumes, and the agent cannot trigger that unilaterally. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
