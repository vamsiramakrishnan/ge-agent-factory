---
type: Data Entity
title: youtube_events
description: Data entity youtube_events owned by YouTube.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# youtube_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| youtube_record_id | ref | required |

# Citations

- Owned by [YouTube](/systems/youtube.md)
