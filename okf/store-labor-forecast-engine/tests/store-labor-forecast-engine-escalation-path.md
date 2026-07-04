---
type: Eval Scenario
title: While running the Store Labor Forecast Engine workflow you encounter this con...
description: "While running the Store Labor Forecast Engine workflow you encounter this condition: Shrink variance exceeds 2% of sales in any store-week, or a single department posts a book-to-physical gap over $10k at inventory.. Handle it end to end."
source_id: "store-labor-forecast-engine-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Store Labor Forecast Engine workflow you encounter this condition: Shrink variance exceeds 2% of sales in any store-week, or a single department posts a book-to-physical gap over $10k at inventory.. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_store_labor_forecast_engine_execution_playbook](/tools/lookup-store-labor-forecast-engine-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Store Labor Forecast Engine Retail Execution Playbook](/documents/store-labor-forecast-engine-execution-playbook.md)
