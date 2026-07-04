---
type: Eval Scenario
title: While running the Truck Roll Avoidance Agent workflow you encounter this cond...
description: "While running the Truck Roll Avoidance Agent workflow you encounter this condition: Repeat truck roll to the same premise within 30 days of a completed work order (repeat_within_30d flag). Handle it end to end."
source_id: "truck-roll-avoidance-agent-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Truck Roll Avoidance Agent workflow you encounter this condition: Repeat truck roll to the same premise within 30 days of a completed work order (repeat_within_30d flag). Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_truck_roll_avoidance_agent_assurance_runbook](/tools/lookup-truck-roll-avoidance-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Truck Roll Avoidance Agent Service Assurance Runbook](/documents/truck-roll-avoidance-agent-assurance-runbook.md)
