---
type: Policy
title: Escalation policy 7
description: "When A SKU's forecast_overrides override_pct exceeds +/-50% of statistical_baseline_units in demand_forecasts for three consecutive forecast_week periods with no matching seasonal_profiles peak_week and no documented override_reason other than category_judgment; action: escalate_to_human; handoff: Demand Planning Manager"
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
| A SKU's forecast_overrides override_pct exceeds +/-50% of statistical_baseline_units in demand_forecasts for three consecutive forecast_week periods with no matching seasonal_profiles peak_week and no documented override_reason other than category_judgment | escalate_to_human | Demand Planning Manager | Repeated large unexplained overrides usually signal a broken forecast model or an undisclosed local event; the Allocation Analyst needs to validate the cause before parameters are retuned chain-wide. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
