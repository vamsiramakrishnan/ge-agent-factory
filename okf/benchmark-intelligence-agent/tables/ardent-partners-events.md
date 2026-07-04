---
type: Data Entity
title: ardent_partners_events
description: Data entity ardent_partners_events owned by Ardent Partners.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ardent_partners_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| ardent_partners_record_id | ref | required |

# Citations

- Owned by [Ardent Partners](/systems/ardent-partners.md)
