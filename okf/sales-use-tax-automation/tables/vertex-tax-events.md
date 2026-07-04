---
type: Data Entity
title: vertex_tax_events
description: Data entity vertex_tax_events owned by Vertex Tax.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# vertex_tax_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| vertex_tax_record_id | ref | required |

# Citations

- Owned by [Vertex Tax](/systems/vertex-tax.md)
