---
type: Data Entity
title: google_news_api_events
description: Data entity google_news_api_events owned by Google News API.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# google_news_api_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| google_news_api_record_id | ref | required |

# Citations

- Owned by [Google News API](/systems/google-news-api.md)
