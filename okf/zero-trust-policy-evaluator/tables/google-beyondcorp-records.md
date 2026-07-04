---
type: Data Entity
title: google_beyondcorp_records
description: Data entity google_beyondcorp_records owned by Google BeyondCorp.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# google_beyondcorp_records

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

- Owned by [Google BeyondCorp](/systems/google-beyondcorp.md)
