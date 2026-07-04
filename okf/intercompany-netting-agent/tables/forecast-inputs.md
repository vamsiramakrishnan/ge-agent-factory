---
type: Data Entity
title: forecast_inputs
description: Data entity forecast_inputs owned by Kyriba.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# forecast_inputs

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| cost_center | lorem.words | required |
| period | enum | required; values: month, quarter, year |
| budget_amount | number | required |
| actual_amount | number | required |
| variance_pct | float | required |
| scenario | enum | required; values: baseline, stretch, downside |

# Citations

- Owned by [Kyriba](/systems/kyriba.md)
