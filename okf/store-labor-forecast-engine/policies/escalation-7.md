---
type: Policy
title: Escalation policy 7
description: "When clock_variance_minutes on timecards exceeds 60 minutes for the same employee_id on three or more shift_date entries within a single forecast_week; action: request_more_info; handoff: store_manager"
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
| clock_variance_minutes on timecards exceeds 60 minutes for the same employee_id on three or more shift_date entries within a single forecast_week | request_more_info | store_manager | Repeated large clock variances signal a broken time clock, buddy-punching, or a payroll compliance issue that must be verified before the interval forecast bakes in tainted worked_hours. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
