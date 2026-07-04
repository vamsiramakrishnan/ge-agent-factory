---
type: Policy
title: Escalation policy 8
description: "When The weekly schedule proposal would push any crew's committed technician-hours above 100% of available capacity while 3 or more P1 ServiceNow incidents remain open; action: request_more_info; handoff: Maintenance Supervisor"
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
| The weekly schedule proposal would push any crew's committed technician-hours above 100% of available capacity while 3 or more P1 ServiceNow incidents remain open | request_more_info | Maintenance Supervisor | Over-committing the crew in a week with multiple open P1 incidents risks silently dropping the higher-severity incident work; the supervisor must resequence the proposal before it is published to the Monday meeting. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
