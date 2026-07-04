---
type: Data Entity
title: regulatory_feeds_events
description: Data entity regulatory_feeds_events owned by Regulatory Feeds.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# regulatory_feeds_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| regulatory_feeds_record_id | ref | required |

# Citations

- Owned by [Regulatory Feeds](/systems/regulatory-feeds.md)
