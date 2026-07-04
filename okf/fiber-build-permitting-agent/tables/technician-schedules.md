---
type: Data Entity
title: technician_schedules
description: Data entity technician_schedules owned by Oracle Field Service.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# technician_schedules

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| technician_id | number | required |
| technician_name | person.fullName | required |
| garage_location | enum | required; values: north_garage, south_garage, east_garage, west_garage, metro_hub |
| shift_date | date | required |
| primary_skill | enum | required; values: fiber_splicing, copper_repair, fixed_wireless_install, cpe_advanced, tower_crew |
| tower_climb_certified | boolean | required |
| jobs_assigned | number | required |
| overtime_hours | float |  |
| on_call | boolean | required |

# Citations

- Owned by [Oracle Field Service](/systems/oracle-field-service.md)
