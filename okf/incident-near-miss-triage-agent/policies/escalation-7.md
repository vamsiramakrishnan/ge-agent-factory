---
type: Policy
title: Escalation policy 7
description: "When A ServiceNow corrective-action ticket tied to a recordable, restricted_duty_dart, lost_time_dart, or fatality safety_incidents entry has sla_met=false and created_at more than 30 days in the past; action: escalate_to_human; handoff: ehs_manager"
source_id: "escalation-7"
tags:
  - manufacturing
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
| A ServiceNow corrective-action ticket tied to a recordable, restricted_duty_dart, lost_time_dart, or fatality safety_incidents entry has sla_met=false and created_at more than 30 days in the past | escalate_to_human | ehs_manager | Corrective actions open past 30 days on a recordable case put both the 90% on-time-closure KPI and the abatement documentation OSHA expects at the next inspection at risk; a manager must reassign or expedite before it ages further. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
