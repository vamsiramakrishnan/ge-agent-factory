---
type: Data Entity
title: punchout_catalogs_events
description: Data entity punchout_catalogs_events owned by Punchout catalogs.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# punchout_catalogs_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |

# Citations

- Owned by [Punchout catalogs](/systems/punchout-catalogs.md)
