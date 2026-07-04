---
type: Policy
title: Escalation policy 8
description: "When A battery/generator degradation trend in analytics_events crosses the runbook's replace-now threshold within 30 days of the region's storm-season start date; action: escalate_to_human; handoff: power_systems_engineer"
source_id: "escalation-8"
tags:
  - telco
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
| A battery/generator degradation trend in analytics_events crosses the runbook's replace-now threshold within 30 days of the region's storm-season start date | escalate_to_human | power_systems_engineer | Deferring a failing backup-power replacement into storm season is exactly the gap the battery/generator failure-during-outage KPI exists to close; a power systems engineer must confirm swap logistics and interim mitigation (portable generator, priority fuel run) rather than letting the standard PM queue absorb it. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
