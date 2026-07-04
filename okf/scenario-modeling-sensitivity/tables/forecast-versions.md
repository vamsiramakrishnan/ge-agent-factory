---
type: Data Entity
title: forecast_versions
description: Data entity forecast_versions owned by Anaplan.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# forecast_versions

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

- Owned by [Anaplan](/systems/anaplan.md)
