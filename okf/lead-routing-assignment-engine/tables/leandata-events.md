---
type: Data Entity
title: leandata_events
description: Data entity leandata_events owned by LeanData.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# leandata_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| leandata_record_id | ref | required |

# Citations

- Owned by [LeanData](/systems/leandata.md)
