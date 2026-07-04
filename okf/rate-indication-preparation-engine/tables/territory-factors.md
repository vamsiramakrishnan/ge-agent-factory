---
type: Data Entity
title: territory_factors
description: Data entity territory_factors owned by Verisk ISO ERC.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# territory_factors

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| territory_code | number | required |
| state | enum | required; values: TX, FL, CA, NY, IL, GA, PA, OH, NC, MI |
| line_of_business | enum | required; values: personal_auto, homeowners, commercial_property, commercial_auto |
| coverage | enum | required; values: bodily_injury, property_damage, collision, comprehensive, wind_hail, fire_ec, theft |
| territory_relativity | float | required |
| cat_load_factor | float | required |
| credibility_weighted | boolean | required |
| filed_effective_date | date | required |

# Citations

- Owned by [Verisk ISO ERC](/systems/verisk-iso-erc.md)
