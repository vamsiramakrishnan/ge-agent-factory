---
type: Data Entity
title: pricing_schedules
description: Data entity pricing_schedules owned by Icertis.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# pricing_schedules

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| contract_id | ref | required |
| sku | string | required |
| base_price | number | required |
| index_basis | enum | required; values: fixed, lme_aluminum, wti_crude, inflation_cpi |
| dead_band_pct | number | required |
| cap_pct | number | required |

# Citations

- Owned by [Icertis](/systems/icertis.md)
