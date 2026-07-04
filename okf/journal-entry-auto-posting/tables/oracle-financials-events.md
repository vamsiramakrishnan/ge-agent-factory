---
type: Data Entity
title: oracle_financials_events
description: Data entity oracle_financials_events owned by Oracle Financials.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# oracle_financials_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| oracle_financials_record_id | ref | required |

# Citations

- Owned by [Oracle Financials](/systems/oracle-financials.md)
