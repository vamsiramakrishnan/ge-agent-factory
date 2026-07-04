---
type: Data Entity
title: amazon_business_events
description: Data entity amazon_business_events owned by Amazon Business.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# amazon_business_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| amazon_business_record_id | ref | required |

# Citations

- Owned by [Amazon Business](/systems/amazon-business.md)
