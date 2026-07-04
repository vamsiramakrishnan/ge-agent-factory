---
type: Policy
title: Escalation policy 6
description: "When Proposed assortment reset drops more than 15% of active SKUs in a class or reduces shelf holding power below presentation minimums.; action: request_more_info; handoff: space_planning_team"
source_id: "escalation-6"
tags:
  - retail
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
| Proposed assortment reset drops more than 15% of active SKUs in a class or reduces shelf holding power below presentation minimums. | request_more_info | space_planning_team | Deep deletes need planogram, transition-inventory, and vendor-commitment analysis before execution; acting on incomplete reset data strands inventory. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
