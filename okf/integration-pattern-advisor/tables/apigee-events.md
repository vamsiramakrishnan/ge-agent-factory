---
type: Data Entity
title: apigee_events
description: Data entity apigee_events owned by Apigee.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# apigee_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| apigee_record_id | ref | required |

# Citations

- Owned by [Apigee](/systems/apigee.md)
