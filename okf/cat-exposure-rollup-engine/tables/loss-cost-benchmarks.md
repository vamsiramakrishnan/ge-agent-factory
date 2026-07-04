---
type: Data Entity
title: loss_cost_benchmarks
description: Data entity loss_cost_benchmarks owned by Verisk ISO ERC.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# loss_cost_benchmarks

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| benchmark_id | seq | required |
| annual_statement_line | enum | required; values: 19_2_private_passenger_auto_liability, 21_1_auto_physical_damage, 04_homeowners_multi_peril, 05_1_commercial_multi_peril, 16_workers_compensation, 17_1_other_liability_occurrence, 01_fire |
| state | enum | required; values: TX, FL, CA, NY, IL, GA, PA, OH, NC, MI |
| class_code | number | required |
| advisory_loss_cost | float | required |
| loss_cost_multiplier | float | required |
| annual_trend_factor | float | required |
| credibility_factor | float | required |
| loss_cost_effective_date | date | required |

# Citations

- Owned by [Verisk ISO ERC](/systems/verisk-iso-erc.md)
