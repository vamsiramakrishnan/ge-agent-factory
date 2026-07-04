---
type: Eval Scenario
title: While running the Demand Forecast Exception Agent workflow you encounter this...
description: "While running the Demand Forecast Exception Agent workflow you encounter this condition: Out-of-stock rate on A-velocity items exceeds 5% during an active promo window, or projected store on-hand falls below presentation minimum before the next scheduled delivery.. Handle it end to end."
source_id: "demand-forecast-exception-agent-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Demand Forecast Exception Agent workflow you encounter this condition: Out-of-stock rate on A-velocity items exceeds 5% during an active promo window, or projected store on-hand falls below presentation minimum before the next scheduled delivery.. Handle it end to end.

## Validates

- [nightly-exception-scan](/queries/nightly-exception-scan.md)

## Mechanisms to call

- [lookup_demand_forecast_exception_agent_execution_playbook](/tools/lookup-demand-forecast-exception-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Demand Forecast Exception Agent Retail Execution Playbook](/documents/demand-forecast-exception-agent-execution-playbook.md)
