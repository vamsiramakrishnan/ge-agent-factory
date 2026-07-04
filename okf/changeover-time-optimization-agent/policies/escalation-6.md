---
type: Policy
title: Escalation policy 6
description: "When Request to modify or reverse a work center confirmation more than 24 hours after shift close; action: request_more_info; handoff: production_supervisor"
source_id: "escalation-6"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.5
generation_status: generated
ge_status: generated
---

# Escalation policy 6

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.5

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Request to modify or reverse a work center confirmation more than 24 hours after shift close | request_more_info | production_supervisor | Late confirmation corrections are the most common vector for labor and yield misreporting; the supervisor must verify the physical count before the record changes. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
