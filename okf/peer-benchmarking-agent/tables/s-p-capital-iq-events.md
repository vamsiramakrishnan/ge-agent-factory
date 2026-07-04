---
type: Data Entity
title: s_p_capital_iq_events
description: "Data entity s_p_capital_iq_events owned by S&P Capital IQ."
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# s_p_capital_iq_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| s_p_capital_iq_record_id | ref | required |

# Citations

- Owned by [S&P Capital IQ](/systems/s-p-capital-iq.md)
