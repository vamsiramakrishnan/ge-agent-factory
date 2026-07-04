---
type: Data Entity
title: weather_apis_events
description: Data entity weather_apis_events owned by Weather APIs.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# weather_apis_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| weather_apis_record_id | ref | required |

# Citations

- Owned by [Weather APIs](/systems/weather-apis.md)
