---
type: Data Entity
title: telco_3_events
description: Data entity telco_3_events owned by TELCO 3.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# telco_3_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| telco_3_record_id | ref | required |

# Citations

- Owned by [TELCO 3](/systems/telco-3.md)
