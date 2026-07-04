---
type: Data Entity
title: item_master
description: Data entity item_master owned by Oracle Retail MFCS.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# item_master

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| sku | number | required |
| upc | number | required |
| item_description | lorem.sentence | required |
| department | enum | required; values: grocery, produce, meat_seafood, dairy_frozen, general_merchandise, health_beauty, apparel, home |
| brand | company.name | required |
| unit_cost | float | required |
| base_retail | float | required |
| item_status | enum | required; values: active, discontinued, seasonal, clearance, new |
| case_pack | number | required |

# Citations

- Owned by [Oracle Retail MFCS](/systems/oracle-retail-mfcs.md)
