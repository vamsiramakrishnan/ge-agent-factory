---
type: Eval Scenario
title: While running the Tower Maintenance Scheduling Engine workflow you encounter ...
description: "While running the Tower Maintenance Scheduling Engine workflow you encounter this condition: Repeat truck roll to the same premise within 30 days of a completed work order (repeat_within_30d flag). Handle it end to end."
source_id: "tower-maintenance-scheduling-engine-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Tower Maintenance Scheduling Engine workflow you encounter this condition: Repeat truck roll to the same premise within 30 days of a completed work order (repeat_within_30d flag). Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_tower_maintenance_scheduling_engine_assurance_runbook](/tools/lookup-tower-maintenance-scheduling-engine-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Tower Maintenance Scheduling Engine Service Assurance Runbook](/documents/tower-maintenance-scheduling-engine-assurance-runbook.md)
