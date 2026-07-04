---
type: Data Entity
title: capability_assessments_events
description: Data entity capability_assessments_events owned by Capability Assessments.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# capability_assessments_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| capability_assessments_record_id | ref | required |

# Citations

- Owned by [Capability Assessments](/systems/capability-assessments.md)
