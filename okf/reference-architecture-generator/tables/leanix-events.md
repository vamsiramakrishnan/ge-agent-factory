---
type: Data Entity
title: leanix_events
description: Data entity leanix_events owned by LeanIX.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# leanix_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| leanix_record_id | ref | required |

# Citations

- Owned by [LeanIX](/systems/leanix.md)
