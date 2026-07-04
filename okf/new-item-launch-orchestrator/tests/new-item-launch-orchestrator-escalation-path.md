---
type: Eval Scenario
title: While running the New Item Launch Orchestrator workflow you encounter this co...
description: "While running the New Item Launch Orchestrator workflow you encounter this condition: Forecast override exceeds 30% versus the statistical baseline, or overrides touch more than 10% of SKU-store combinations in a single class-week.. Handle it end to end."
source_id: "new-item-launch-orchestrator-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the New Item Launch Orchestrator workflow you encounter this condition: Forecast override exceeds 30% versus the statistical baseline, or overrides touch more than 10% of SKU-store combinations in a single class-week.. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_new_item_launch_orchestrator_execution_playbook](/tools/lookup-new-item-launch-orchestrator-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [New Item Launch Orchestrator Retail Execution Playbook](/documents/new-item-launch-orchestrator-execution-playbook.md)
