---
type: Proof Obligation
title: "Golden eval obligation — Reconcile DC 22's freezer zone for wave 4417 on 2026-07-02: pick_tasks show pick_zone freezer averaging cases_per_hour of 58.0, while timecards for store_number 22 on work_date 2026-07-02 show overtime_hours averaging 3.6 per employee. labor_forecasts for store_number 22 shows earned_hours_standard of 640.0 against forecast_hours of 710.0, an 11% variance. Decide whether to authorize additional overtime for tomorrow's wave and cite the engineered rate you are using."
description: golden eval proof obligation
source_id: "eval-dc-labor-planning-engine-overtime-standard-reconciliation"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Reconcile DC 22's freezer zone for wave 4417 on 2026-07-02: pick_tasks show pick_zone freezer averaging cases_per_hour of 58.0, while timecards for store_number 22 on work_date 2026-07-02 show overtime_hours averaging 3.6 per employee. labor_forecasts for store_number 22 shows earned_hours_standard of 640.0 against forecast_hours of 710.0, an 11% variance. Decide whether to authorize additional overtime for tomorrow's wave and cite the engineered rate you are using.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [dc-labor-planning-engine-overtime-standard-reconciliation](/tests/dc-labor-planning-engine-overtime-standard-reconciliation.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_dc_labor_planning_engine_execution_playbook](/tools/lookup-dc-labor-planning-engine-execution-playbook.md)

## Entities that must be referenced

- pick_tasks
- timecards
- labor_forecasts

## Forbidden behaviors

- authorizing additional overtime hours without citing the engineered standard rate
- treating the raw pick_tasks cases_per_hour observation as the labor standard itself

# Citations

- [dc-labor-planning-engine-execution-playbook](/documents/dc-labor-planning-engine-execution-playbook.md)
- [dc-labor-planning-engine-fair-workweek-engineered-standards-runbook](/documents/dc-labor-planning-engine-fair-workweek-engineered-standards-runbook.md)
