---
type: Policy
title: Escalation policy 7
description: "When Projected drive time share for the day's optimized route exceeds 25% of scheduled work hours for any technician; action: escalate_to_human; handoff: dispatch_supervisor"
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
| Projected drive time share for the day's optimized route exceeds 25% of scheduled work hours for any technician | escalate_to_human | dispatch_supervisor | A route that erodes drive-time savings usually reflects a garage-to-territory mismatch or an under-resourced zone the optimizer alone can't fix; a supervisor must rebalance the garage assignment or add capacity rather than let the KPI silently regress. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
