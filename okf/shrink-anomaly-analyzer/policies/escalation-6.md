---
type: Policy
title: Escalation policy 6
description: "When Cash over/short exceeds $250 on a single drawer-day, or the same register shows a directional variance three business days running.; action: request_more_info; handoff: front_end_supervisor"
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
| Cash over/short exceeds $250 on a single drawer-day, or the same register shows a directional variance three business days running. | request_more_info | front_end_supervisor | Patterned variance needs journal review and possible till audit before any coaching or accusation; premature action creates HR and defamation risk. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
