---
type: Data Entity
title: irs_tin_events
description: Data entity irs_tin_events owned by IRS TIN.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# irs_tin_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| irs_tin_record_id | ref | required |

# Citations

- Owned by [IRS TIN](/systems/irs-tin.md)
