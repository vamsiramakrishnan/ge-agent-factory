---
type: Data Entity
title: asset_registry_entries
description: Data entity asset_registry_entries owned by IBM Maximo.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# asset_registry_entries

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| asset_number | number | required |
| asset_class | enum | required; values: cnc_machine, stamping_press, robot_cell, conveyor, air_compressor, boiler, chiller, agv |
| criticality_ranking | enum | required; values: a_constraint, b_essential, c_important, d_redundant |
| manufacturer | company.name | required |
| install_date | date | required |
| replacement_value_usd | number | required |
| mtbf_hours | float |  |
| mttr_hours | float |  |
| in_service | boolean | required |

# Citations

- Owned by [IBM Maximo](/systems/ibm-maximo.md)
