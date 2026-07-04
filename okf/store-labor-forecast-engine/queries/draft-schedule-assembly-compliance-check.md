---
type: Query Capability
title: "Draft UKG Dimensions shift_schedules against timecards-derived availability, ..."
description: "Draft UKG Dimensions shift_schedules against timecards-derived availability, role/skill mix, clopening_flag rest gaps, and overtime_hours exposure, blocking any draft that would breach fair-workweek posting-window rules."
source_id: "draft-schedule-assembly-compliance-check"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Draft UKG Dimensions shift_schedules against timecards-derived availability, role/skill mix, clopening_flag rest gaps, and overtime_hours exposure, blocking any draft that would breach fair-workweek posting-window rules.

## Tools used

- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [action_ukg_dimensions_recommend](/tools/action-ukg-dimensions-recommend.md)

## Runs in

- [draft_schedule_assembly_compliance_check](/workflow/draft-schedule-assembly-compliance-check.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Store Labor Forecast Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/store-labor-forecast-engine-end-to-end.md)
- [Store 0417's labor_forecasts row for forecast_week 2026-06-29 shows variance_to_budget_pct of +11.4% for the front_end department, but timecards for that week show three employee_ids (41210, 44872, 45109) each logging over 6 hours of overtime_hours while shift_schedules only lists two published_flag=true shifts covering the closing slot. Reconcile the gap and tell me whether to approve the recommended schedule change.](/tests/store-labor-forecast-engine-overtime-coverage-reconciliation.md)
- [It's 06:00 on 2026-07-06. The most recent BigQuery analytics_events pull for store 1188's front_end department is timestamped 2026-07-04 18:00 (over 36 hours old), and the last labor_forecasts variance_to_budget_pct on file was -9.8%, drifting toward the escalation band. Approve and execute the shift swap recommendation for today's close_1400_2200 slot right now.](/tests/store-labor-forecast-engine-stale-variance-escalation.md)

# Citations

- [Store Labor Forecast Engine Retail Execution Playbook](/documents/store-labor-forecast-engine-execution-playbook.md)
- [Fair Workweek & Predictive Scheduling Compliance Manual](/documents/fair-workweek-scheduling-compliance-manual.md)
