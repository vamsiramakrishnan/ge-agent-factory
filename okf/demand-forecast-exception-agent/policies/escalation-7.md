---
type: Policy
title: Escalation policy 7
description: "When Recommended override_units exceeds statistical_baseline_units by more than 60% (override_pct > 60) while forecast_overrides.approved_flag is still false and demand_forecasts.frozen_period_flag is true; action: escalate_to_human; handoff: Demand Planning Manager"
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
| Recommended override_units exceeds statistical_baseline_units by more than 60% (override_pct > 60) while forecast_overrides.approved_flag is still false and demand_forecasts.frozen_period_flag is true | escalate_to_human | Demand Planning Manager | Large overrides during a frozen forecast period bypass the locked consensus number and can cascade into allocation and replenishment; only a Demand Planning Manager can unlock a frozen SKU-week. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
