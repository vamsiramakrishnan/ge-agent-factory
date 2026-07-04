---
type: Policy
title: Escalation policy 5
description: "When Requested schedule change falls inside the 14-day fair-workweek posting window, or cumulative weekly hours would push an associate over the overtime or minor-work-hour threshold.; action: escalate_to_human; handoff: store_manager"
source_id: "escalation-5"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.4
generation_status: generated
ge_status: generated
---

# Escalation policy 5

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.4

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Requested schedule change falls inside the 14-day fair-workweek posting window, or cumulative weekly hours would push an associate over the overtime or minor-work-hour threshold. | escalate_to_human | store_manager | In-window changes carry predictability-pay obligations and compliance exposure; only management can accept the premium cost or obtain documented voluntary consent. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
