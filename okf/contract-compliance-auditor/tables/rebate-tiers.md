---
type: Data Entity
title: rebate_tiers
description: Data entity rebate_tiers owned by Icertis.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# rebate_tiers

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| contract_id | ref | required |
| tier_name | string | required |
| threshold_amount | number | required |
| rebate_pct | number | required |

# Citations

- Owned by [Icertis](/systems/icertis.md)
