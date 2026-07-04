---
type: Policy
title: Escalation policy 8
description: "When A proposed resequencing recommendation would reorder two process_orders whose linked material_stagings show shortage_flag=true or staging_status other than 'staged' for the incoming order; action: request_more_info; handoff: Production Supervisor"
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
| A proposed resequencing recommendation would reorder two process_orders whose linked material_stagings show shortage_flag=true or staging_status other than 'staged' for the incoming order | request_more_info | Production Supervisor | Resequencing around unstaged or shorted material produces a paper win only -- the changeover cannot actually start on the recommended sequence until staging is confirmed. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
