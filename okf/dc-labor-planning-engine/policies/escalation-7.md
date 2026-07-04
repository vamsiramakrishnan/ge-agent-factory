---
type: Policy
title: Escalation policy 7
description: "When A generated shift plan would push overtime_hours in timecards above 4 hours/day for more than 10% of scheduled employees in a single department; action: escalate_to_human; handoff: labor_relations_partner"
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
| A generated shift plan would push overtime_hours in timecards above 4 hours/day for more than 10% of scheduled employees in a single department | escalate_to_human | labor_relations_partner | Overtime concentrated in one department risks breaching the 4%-of-payroll target and may implicate union agreement premium-pay rules that the agent should not resolve unilaterally. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
