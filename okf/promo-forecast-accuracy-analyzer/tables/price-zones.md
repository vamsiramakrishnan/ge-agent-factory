---
type: Data Entity
title: price_zones
description: Data entity price_zones owned by Revionics Price Optimization.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# price_zones

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| price_zone_id | number | required |
| zone_name | enum | required; values: national_base, urban_high_cost, rural_value, border_competitive, resort_premium, ecom_national |
| pricing_strategy | enum | required; values: edlp, hi_lo, hybrid, premium |
| store_count | number | required |
| competitive_price_index | float | required |
| kvi_item_count | number | required |
| tax_jurisdiction_count | number |  |
| last_rezone_date | date | required |

# Citations

- Owned by [Revionics Price Optimization](/systems/revionics-price-optimization.md)
