---
type: Policy
title: Escalation policy 7
description: "When No adjuster licensed for the claim's jurisdiction_state and line_of_business shows available workload capacity in Guidewire ClaimCenter at the moment of routing; action: escalate_to_human; handoff: Claims intake supervisor"
source_id: "escalation-7"
tags:
  - insurance
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
| No adjuster licensed for the claim's jurisdiction_state and line_of_business shows available workload capacity in Guidewire ClaimCenter at the moment of routing | escalate_to_human | Claims intake supervisor | Forcing an assignment to an unlicensed or over-capacity adjuster to hit the routing SLA creates a licensing exposure and a same-day workload failure that only a supervisor can rebalance. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
