---
type: Eval Scenario
title: While running the Production Schedule Adherence Monitor workflow you encounte...
description: "While running the Production Schedule Adherence Monitor workflow you encounter this condition: Unplanned downtime exceeding 4 hours on an asset flagged constraint_asset=true. Handle it end to end."
source_id: "production-schedule-adherence-monitor-escalation-path"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Production Schedule Adherence Monitor workflow you encounter this condition: Unplanned downtime exceeding 4 hours on an asset flagged constraint_asset=true. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_production_schedule_adherence_monitor_sop](/tools/lookup-production-schedule-adherence-monitor-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Production Schedule Adherence Monitor Standard Operating Procedure](/documents/production-schedule-adherence-monitor-sop.md)
