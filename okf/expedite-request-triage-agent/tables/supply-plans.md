---
type: Data Entity
title: supply_plans
description: Data entity supply_plans owned by Kinaxis RapidResponse.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# supply_plans

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| plan_number | number | required |
| material_number | number | required |
| supplying_plant | enum | required; values: 1010, 1020, 2040, 3100, external_vendor |
| planning_horizon_weeks | number | required |
| planned_supply_qty | number | required |
| safety_stock_qty | number | required |
| plan_status | enum | required; values: draft, published, committed, revised |
| supply_risk_score | float |  |
| plan_date | date | required |

# Citations

- Owned by [Kinaxis RapidResponse](/systems/kinaxis-rapidresponse.md)
