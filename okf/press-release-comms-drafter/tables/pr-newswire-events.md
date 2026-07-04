---
type: Data Entity
title: pr_newswire_events
description: Data entity pr_newswire_events owned by PR Newswire.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# pr_newswire_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| pr_newswire_record_id | ref | required |

# Citations

- Owned by [PR Newswire](/systems/pr-newswire.md)
