---
type: Policy
title: Escalation policy 7
description: "When Live queue_metrics show abandon_rate_pct above 10% and csat_score below 3.5 for the same queue_name and metric_date; action: escalate_to_human; handoff: workforce_management_planner"
source_id: "escalation-7"
tags:
  - telco
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
| Live queue_metrics show abandon_rate_pct above 10% and csat_score below 3.5 for the same queue_name and metric_date | escalate_to_human | workforce_management_planner | A simultaneous abandon and satisfaction breakdown signals a staffing or skill-mix gap that scripted next-best-action guidance cannot fix; only a WFM planner can rebalance schedules or add real-time intraday coverage. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
