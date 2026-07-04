---
type: Workflow Stage
title: "Shift Plan & Flex-Labor Assembly"
description: "Generate department-level shift_schedules in UKG Dimensions sized to the scored gap, drawing on labor_forecasts flex_hours and temp-labor options before the 72-hour cutoff."
source_id: shift_plan_flex_labor_assembly
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Shift Plan & Flex-Labor Assembly

Generate department-level shift_schedules in UKG Dimensions sized to the scored gap, drawing on labor_forecasts flex_hours and temp-labor options before the 72-hour cutoff.

- **Mode:** sequential
- **Stage:** 4 of 6

## Tools

- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [lookup_dc_labor_planning_engine_execution_playbook](/tools/lookup-dc-labor-planning-engine-execution-playbook.md)
- [action_manhattan_active_wm_generate](/tools/action-manhattan-active-wm-generate.md)

Next: [Playbook & Runbook Validation](/workflow/playbook-runbook-validation.md)
