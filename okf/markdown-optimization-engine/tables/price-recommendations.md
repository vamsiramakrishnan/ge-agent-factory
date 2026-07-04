---
type: Data Entity
title: price_recommendations
description: Data entity price_recommendations owned by Revionics Price Optimization.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# price_recommendations

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| sku | number | required |
| price_zone_id | number | required |
| current_retail | float | required |
| recommended_retail | float | required |
| markdown_cadence | enum | required; values: no_markdown, first_markdown_25, second_markdown_40, third_markdown_60, final_clearance_75 |
| effective_date | date | required |
| weeks_of_supply | float | required |
| margin_impact_dollars | float | required |
| sell_through_target_pct | float | required |

# Citations

- Owned by [Revionics Price Optimization](/systems/revionics-price-optimization.md)
