---
type: Policy
title: Escalation policy 8
description: "When A department's forecast_hours in labor_forecasts requires a fulfillment_picker or department_lead shift_slot with zero eligible employee_ids showing that role in shift_schedules for the forecast_week; action: escalate_to_human; handoff: store_manager"
source_id: "escalation-8"
tags:
  - retail
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
| A department's forecast_hours in labor_forecasts requires a fulfillment_picker or department_lead shift_slot with zero eligible employee_ids showing that role in shift_schedules for the forecast_week | escalate_to_human | store_manager | The forecast cannot be honored without a qualified body in the role; only the store manager can authorize cross-training, transfers, or an accepted coverage gap. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
