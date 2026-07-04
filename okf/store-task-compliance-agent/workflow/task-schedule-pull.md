---
type: Workflow Stage
title: "Task & Schedule Pull"
description: "Query shift_schedules, timecards, and labor_forecasts from UKG Dimensions (query_ukg_dimensions_shift_schedules) to establish which stores and shifts owed which corporate tasks this period."
source_id: task_schedule_pull
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Task & Schedule Pull

Query shift_schedules, timecards, and labor_forecasts from UKG Dimensions (query_ukg_dimensions_shift_schedules) to establish which stores and shifts owed which corporate tasks this period.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [lookup_store_task_compliance_agent_execution_playbook](/tools/lookup-store-task-compliance-agent-execution-playbook.md)
- [action_ukg_dimensions_escalate](/tools/action-ukg-dimensions-escalate.md)

Next: [POS Execution Cross-Check](/workflow/pos-execution-cross-check.md)
