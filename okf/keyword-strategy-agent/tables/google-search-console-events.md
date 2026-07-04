---
type: Data Entity
title: google_search_console_events
description: Data entity google_search_console_events owned by Google Search Console.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# google_search_console_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| google_search_console_record_id | ref | required |

# Citations

- Owned by [Google Search Console](/systems/google-search-console.md)
