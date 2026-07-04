---
type: Data Entity
title: safety_incidents
description: Data entity safety_incidents owned by Sphera EHS.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# safety_incidents

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| incident_number | number | required |
| osha_classification | enum | required; values: near_miss, first_aid, recordable, restricted_duty_dart, lost_time_dart, fatality |
| injury_type | enum | required; values: laceration, strain_sprain, contusion, burn, fracture, foreign_body_eye, amputation |
| days_away | number |  |
| shift | enum | required; values: first, second, third, weekend |
| incident_date | date | required |
| root_cause_complete | boolean | required |
| reported_to_osha | boolean | required |
| description | lorem.sentence |  |

# Citations

- Owned by [Sphera EHS](/systems/sphera-ehs.md)
