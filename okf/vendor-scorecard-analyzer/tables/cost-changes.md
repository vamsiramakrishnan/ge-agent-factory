---
type: Data Entity
title: cost_changes
description: Data entity cost_changes owned by Oracle Retail MFCS.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# cost_changes

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| sku | number | required |
| vendor_number | number | required |
| old_unit_cost | float | required |
| new_unit_cost | float | required |
| effective_date | date | required |
| change_reason | enum | required; values: commodity_increase, freight_surcharge, tariff_adjustment, contract_renegotiation, allowance_expiration, currency_fluctuation |
| cost_change_pct | float | required |
| bracket_quantity | number |  |
| approval_status | enum | required; values: pending, approved, rejected, auto_approved |

# Citations

- Owned by [Oracle Retail MFCS](/systems/oracle-retail-mfcs.md)
