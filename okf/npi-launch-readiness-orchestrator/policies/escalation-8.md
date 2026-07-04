---
type: Policy
title: Escalation policy 8
description: "When The readiness pack shows an engineering_change_orders.approval_status of 'released' but the linked bom_revisions.valid_from date postdates the gate date; action: request_more_info; handoff: change_analyst"
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
| The readiness pack shows an engineering_change_orders.approval_status of 'released' but the linked bom_revisions.valid_from date postdates the gate date | request_more_info | change_analyst | A released ECO whose BOM effectivity hasn't caught up means production cannot build to the approved configuration by the gate; a change_analyst must confirm whether this is a data lag or a genuine schedule miss before the pack goes to the gate review. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
