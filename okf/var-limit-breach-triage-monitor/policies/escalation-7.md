---
type: Policy
title: Escalation policy 7
description: "When limit_utilization_pct remains above 100% for the same desk across three or more consecutive as_of_date risk runs in risk_measures without a ServiceNow ticket showing an accepted cure plan; action: escalate_to_human; handoff: desk_head"
source_id: "escalation-7"
tags:
  - banking
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
| limit_utilization_pct remains above 100% for the same desk across three or more consecutive as_of_date risk runs in risk_measures without a ServiceNow ticket showing an accepted cure plan | escalate_to_human | desk_head | Persistent, unremediated excess beyond a single risk run indicates the desk is trading through the limit rather than curing it, which requires desk-head sign-off before the next risk run. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
