---
type: Eval Scenario
title: While running the Store Replenishment Orchestrator workflow you encounter thi...
description: "While running the Store Replenishment Orchestrator workflow you encounter this condition: Out-of-stock rate on A-velocity items exceeds 5% during an active promo window, or projected store on-hand falls below presentation minimum before the next scheduled delivery.. Handle it end to end."
source_id: "store-replenishment-orchestrator-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Store Replenishment Orchestrator workflow you encounter this condition: Out-of-stock rate on A-velocity items exceeds 5% during an active promo window, or projected store on-hand falls below presentation minimum before the next scheduled delivery.. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_store_replenishment_orchestrator_execution_playbook](/tools/lookup-store-replenishment-orchestrator-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Store Replenishment Orchestrator Retail Execution Playbook](/documents/store-replenishment-orchestrator-execution-playbook.md)
