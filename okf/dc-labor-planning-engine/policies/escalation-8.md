---
type: Policy
title: Escalation policy 8
description: "When clock_variance_minutes exceeds the +/-30 minute tolerance on more than 5% of timecards tied to a published shift_schedules plan for the same shift_date; action: request_more_info; handoff: ukg_timekeeping_administrator"
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
| clock_variance_minutes exceeds the +/-30 minute tolerance on more than 5% of timecards tied to a published shift_schedules plan for the same shift_date | request_more_info | ukg_timekeeping_administrator | Widespread clock variance signals a timekeeping-system or badge issue; the labor_forecasts variance calculation is unreliable until the timecard integrity issue is confirmed and corrected. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
