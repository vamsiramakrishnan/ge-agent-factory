---
type: Data Entity
title: irs_tin_matching_records
description: Data entity irs_tin_matching_records owned by IRS TIN Matching.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# irs_tin_matching_records

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

- Owned by [IRS TIN Matching](/systems/irs-tin-matching.md)
