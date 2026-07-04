---
type: Data Entity
title: tax_systems_events
description: Data entity tax_systems_events owned by Tax Systems.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# tax_systems_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| tax_systems_record_id | ref | required |

# Citations

- Owned by [Tax Systems](/systems/tax-systems.md)
