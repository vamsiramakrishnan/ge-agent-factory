---
type: Policy
title: Escalation policy 7
description: "When The triangulated break point falls on a fiber segment that is jointly built or IRU-shared with another carrier, or crosses a third-party right-of-way; action: request_more_info; handoff: outside_plant_engineering"
source_id: "escalation-7"
tags:
  - telco
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
| The triangulated break point falls on a fiber segment that is jointly built or IRU-shared with another carrier, or crosses a third-party right-of-way | request_more_info | outside_plant_engineering | Joint-build and IRU segments require coordinating with the co-owner before any splice or reroute; unilateral action can violate the joint-use agreement and duplicate repair effort on a span the agent does not fully control. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
