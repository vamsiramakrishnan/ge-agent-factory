---
type: Data Entity
title: recognition_platform_records
description: Data entity recognition_platform_records owned by Recognition Platform.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# recognition_platform_records

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

- Owned by [Recognition Platform](/systems/recognition-platform.md)
