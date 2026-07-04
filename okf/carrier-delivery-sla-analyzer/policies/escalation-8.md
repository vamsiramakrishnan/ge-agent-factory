---
type: Policy
title: Escalation policy 8
description: "When A proposed lane reassignment would drop a carrier's allocated volume below the minimum volume commitment in its master service agreement.; action: request_more_info; handoff: carrier_relationship_manager"
source_id: "escalation-8"
tags:
  - retail
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
| A proposed lane reassignment would drop a carrier's allocated volume below the minimum volume commitment in its master service agreement. | request_more_info | carrier_relationship_manager | Reassigning volume below a contracted MSA minimum risks breach penalties that only the carrier relationship owner can clear before the agent acts. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
