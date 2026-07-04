---
type: Data Entity
title: risk_measures
description: Data entity risk_measures owned by Murex MX.3.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# risk_measures

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| measure_id | number | required |
| desk | enum | required; values: rates, credit, fx, mortgage, municipal, treasury_alm |
| measure_type | enum | required; values: var_99_1day, stressed_var, dv01, cs01, irrbb_eve_shock_200bp, lcr_ratio, nsfr_ratio |
| measure_value | float | required |
| approved_limit_value | float | required |
| limit_utilization_pct | float | required |
| limit_breach_flag | boolean | required |
| backtest_exceptions_250d | number | required |
| as_of_date | date | required |

# Citations

- Owned by [Murex MX.3](/systems/murex-mx-3.md)
