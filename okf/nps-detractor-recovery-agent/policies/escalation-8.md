---
type: Policy
title: Escalation policy 8
description: "When Detractor responses spike alongside queue_metrics abandon_rate_pct above 10% and service_level_80_20_pct below 60% for the same queue_name across 3 or more consecutive days; action: escalate_to_human; handoff: WFM/Queue Operations Lead"
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
| Detractor responses spike alongside queue_metrics abandon_rate_pct above 10% and service_level_80_20_pct below 60% for the same queue_name across 3 or more consecutive days | escalate_to_human | WFM/Queue Operations Lead | A queue-level service breakdown, not an individual account issue, is driving the detractors; individualized recovery outreach won't fix the root cause and would mask a staffing or routing problem operations needs to address. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
