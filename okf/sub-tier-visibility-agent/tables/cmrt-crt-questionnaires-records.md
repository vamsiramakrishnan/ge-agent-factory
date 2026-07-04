---
type: Data Entity
title: cmrt_crt_questionnaires_records
description: Data entity cmrt_crt_questionnaires_records owned by CMRT/CRT Questionnaires.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# cmrt_crt_questionnaires_records

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| source_record_id | seq | required |
| status | enum | required; values: active, pending, closed |
| owner | person.fullName | required |
| created_at | date | required |
| notes | lorem.sentence |  |

# Citations

- Owned by [CMRT/CRT Questionnaires](/systems/cmrt-crt-questionnaires.md)
