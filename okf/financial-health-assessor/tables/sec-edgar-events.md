---
type: Data Entity
title: sec_edgar_events
description: Data entity sec_edgar_events owned by SEC EDGAR.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# sec_edgar_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| sec_edgar_record_id | ref | required |

# Citations

- Owned by [SEC EDGAR](/systems/sec-edgar.md)
