---
type: Data Entity
title: wbenc_events
description: Data entity wbenc_events owned by WBENC.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# wbenc_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| wbenc_record_id | ref | required |

# Citations

- Owned by [WBENC](/systems/wbenc.md)
