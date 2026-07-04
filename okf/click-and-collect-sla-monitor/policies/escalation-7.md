---
type: Policy
title: Escalation policy 7
description: "When Curbside wait time telemetry for a store exceeds 3x the 3-minute target (crosses 9 minutes) for more than two consecutive hours; action: escalate_to_human; handoff: Store General Manager"
source_id: "escalation-7"
tags:
  - retail
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
| Curbside wait time telemetry for a store exceeds 3x the 3-minute target (crosses 9 minutes) for more than two consecutive hours | escalate_to_human | Store General Manager | Sustained curbside wait past three times target signals a staffing or staging failure that needs a manager on the floor, not another automated reroute. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
