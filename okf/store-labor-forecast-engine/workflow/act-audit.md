---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the recommend step in UKG Dimensions with a full audit trail, and escalate exceptions to the Store Workforce Planner."
source_id: act_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the recommend step in UKG Dimensions with a full audit trail, and escalate exceptions to the Store Workforce Planner.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [lookup_store_labor_forecast_engine_execution_playbook](/tools/lookup-store-labor-forecast-engine-execution-playbook.md)
- [action_ukg_dimensions_recommend](/tools/action-ukg-dimensions-recommend.md)
