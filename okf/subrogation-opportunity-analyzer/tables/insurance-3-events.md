---
type: Data Entity
title: insurance_3_events
description: Data entity insurance_3_events owned by INSURANCE 3.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# insurance_3_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| insurance_3_record_id | ref | required |

# Citations

- Owned by [INSURANCE 3](/systems/insurance-3.md)
