---
type: Data Entity
title: longview_onesource_events
description: Data entity longview_onesource_events owned by Longview/OneSource.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# longview_onesource_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| longview_onesource_record_id | ref | required |

# Citations

- Owned by [Longview/OneSource](/systems/longview-onesource.md)
