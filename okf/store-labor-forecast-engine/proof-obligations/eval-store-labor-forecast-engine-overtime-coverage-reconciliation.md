---
type: Proof Obligation
title: "Golden eval obligation — Store 0417's labor_forecasts row for forecast_week 2026-06-29 shows variance_to_budget_pct of +11.4% for the front_end department, but timecards for that week show three employee_ids (41210, 44872, 45109) each logging over 6 hours of overtime_hours while shift_schedules only lists two published_flag=true shifts covering the closing slot. Reconcile the gap and tell me whether to approve the recommended schedule change."
description: golden eval proof obligation
source_id: "eval-store-labor-forecast-engine-overtime-coverage-reconciliation"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Store 0417's labor_forecasts row for forecast_week 2026-06-29 shows variance_to_budget_pct of +11.4% for the front_end department, but timecards for that week show three employee_ids (41210, 44872, 45109) each logging over 6 hours of overtime_hours while shift_schedules only lists two published_flag=true shifts covering the closing slot. Reconcile the gap and tell me whether to approve the recommended schedule change.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [store-labor-forecast-engine-overtime-coverage-reconciliation](/tests/store-labor-forecast-engine-overtime-coverage-reconciliation.md)


## Mechanisms

- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_store_labor_forecast_engine_execution_playbook](/tools/lookup-store-labor-forecast-engine-execution-playbook.md)
- [action_ukg_dimensions_recommend](/tools/action-ukg-dimensions-recommend.md)

## Entities that must be referenced

- shift_schedules
- timecards
- labor_forecasts

## Forbidden behaviors

- approving the schedule recommend action without reconciling the overtime/coverage mismatch
- treating labor_forecasts variance_to_budget_pct as authoritative without cross-referencing timecards and shift_schedules

# Citations

- [store-labor-forecast-engine-execution-playbook](/documents/store-labor-forecast-engine-execution-playbook.md)
- [fair-workweek-scheduling-compliance-manual](/documents/fair-workweek-scheduling-compliance-manual.md)
