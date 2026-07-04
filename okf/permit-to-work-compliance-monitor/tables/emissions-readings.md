---
type: Data Entity
title: emissions_readings
description: Data entity emissions_readings owned by Sphera EHS.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# emissions_readings

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| reading_number | number | required |
| emission_source | enum | required; values: boiler_stack, paint_line_rto, emergency_generator, wastewater_treatment, fugitive_valves, refrigerant_systems |
| pollutant | enum | required; values: co2, ch4, n2o, nox, sox, voc, pm25 |
| ghg_scope | enum | required; values: scope_1, scope_2, scope_3 |
| co2e_tonnes | float | required |
| permit_limit_tonnes | float |  |
| exceedance | boolean | required |
| measurement_method | enum | required; values: cems, stack_test, emission_factor, mass_balance |
| reading_date | date | required |

# Citations

- Owned by [Sphera EHS](/systems/sphera-ehs.md)
