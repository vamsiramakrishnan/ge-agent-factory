---
type: Data Entity
title: quality_checks
description: Data entity quality_checks owned by Siemens Opcenter MES.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# quality_checks

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| check_number | number | required |
| characteristic | enum | required; values: bore_diameter, overall_length, surface_roughness_ra, hardness_hrc, fastener_torque, flatness |
| measured_value | float | required |
| lower_spec_limit | float | required |
| upper_spec_limit | float | required |
| cpk | float |  |
| result | enum | required; values: pass, fail, conditional |
| inspector_name | person.fullName | required |
| check_date | date | required |

# Citations

- Owned by [Siemens Opcenter MES](/systems/siemens-opcenter-mes.md)
