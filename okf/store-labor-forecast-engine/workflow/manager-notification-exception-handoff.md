---
type: Workflow Stage
title: "Manager Notification & Exception Handoff"
description: "Notify the Store Workforce Planner of coverage gaps against minimum_coverage_hours, recommend shift swaps before schedule_posted_date, and route any escalation-rule trigger to the named handoff role with the audit trail attached."
source_id: manager_notification_exception_handoff
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Manager Notification & Exception Handoff

Notify the Store Workforce Planner of coverage gaps against minimum_coverage_hours, recommend shift swaps before schedule_posted_date, and route any escalation-rule trigger to the named handoff role with the audit trail attached.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_store_labor_forecast_engine_execution_playbook](/tools/lookup-store-labor-forecast-engine-execution-playbook.md)
- [action_ukg_dimensions_recommend](/tools/action-ukg-dimensions-recommend.md)
