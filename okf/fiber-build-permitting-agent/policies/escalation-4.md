---
type: Policy
title: Escalation policy 4
description: "When Repeat truck roll to the same premise within 30 days of a completed work order (repeat_within_30d flag); action: escalate_to_human; handoff: field_quality_supervisor"
source_id: "escalation-4"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.3
generation_status: generated
ge_status: generated
---

# Escalation policy 4

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.3

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Repeat truck roll to the same premise within 30 days of a completed work order (repeat_within_30d flag) | escalate_to_human | field_quality_supervisor | Repeat rolls double cost-to-serve and usually trace to a missed root cause (drop degradation, bad splice, upstream plant issue); the quality loop must review the prior job's test data before another window is burned. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
