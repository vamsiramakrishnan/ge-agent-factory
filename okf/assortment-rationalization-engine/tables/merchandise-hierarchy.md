---
type: Data Entity
title: merchandise_hierarchy
description: Data entity merchandise_hierarchy owned by Oracle Retail MFCS.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# merchandise_hierarchy

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| department_number | number | required |
| department_name | enum | required; values: dry_grocery, produce, meat_seafood, dairy_frozen, general_merchandise, health_beauty, apparel, home_seasonal |
| class_number | number | required |
| class_name | enum | required; values: carbonated_beverages, salty_snacks, packaged_bread, shelf_stable_meals, paper_goods, oral_care, small_appliances, basic_denim, candles_home_fragrance |
| subclass_number | number | required |
| buyer_name | person.fullName | required |
| gmroi_target | float | required |
| markdown_budget_pct | float |  |

# Citations

- Owned by [Oracle Retail MFCS](/systems/oracle-retail-mfcs.md)
