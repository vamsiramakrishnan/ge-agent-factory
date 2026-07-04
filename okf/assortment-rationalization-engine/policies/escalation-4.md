---
type: Policy
title: Escalation policy 4
description: "When Forecast override exceeds 30% versus the statistical baseline, or overrides touch more than 10% of SKU-store combinations in a single class-week.; action: escalate_to_human; handoff: demand_planning_manager"
source_id: "escalation-4"
tags:
  - retail
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
| Forecast override exceeds 30% versus the statistical baseline, or overrides touch more than 10% of SKU-store combinations in a single class-week. | escalate_to_human | demand_planning_manager | Large or broad overrides destroy forecast-accuracy accountability (WMAPE/bias tracking) and usually signal an unmodeled event that should be added to the causal calendar instead of hand-edited. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
