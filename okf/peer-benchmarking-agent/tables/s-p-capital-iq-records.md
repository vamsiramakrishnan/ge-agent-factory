---
type: Data Entity
title: s_p_capital_iq_records
description: "Data entity s_p_capital_iq_records owned by S&P Capital IQ."
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# s_p_capital_iq_records

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

- Owned by [S&P Capital IQ](/systems/s-p-capital-iq.md)
