---
type: Eval Scenario
title: While running the DC Labor Planning Engine workflow you encounter this condit...
description: "While running the DC Labor Planning Engine workflow you encounter this condition: Out-of-stock rate on A-velocity items exceeds 5% during an active promo window, or projected store on-hand falls below presentation minimum before the next scheduled delivery.. Handle it end to end."
source_id: "dc-labor-planning-engine-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the DC Labor Planning Engine workflow you encounter this condition: Out-of-stock rate on A-velocity items exceeds 5% during an active promo window, or projected store on-hand falls below presentation minimum before the next scheduled delivery.. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_dc_labor_planning_engine_execution_playbook](/tools/lookup-dc-labor-planning-engine-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [DC Labor Planning Engine Retail Execution Playbook](/documents/dc-labor-planning-engine-execution-playbook.md)
