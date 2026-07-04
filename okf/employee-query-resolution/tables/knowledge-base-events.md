---
type: Data Entity
title: knowledge_base_events
description: Data entity knowledge_base_events owned by Knowledge Base.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# knowledge_base_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| title | lorem.sentence | required |
| owner | person.fullName | required |
| status | enum | required; values: draft, review, published, archived |
| last_updated | date | required |
| knowledge_base_record_id | ref | required |

# Citations

- Owned by [Knowledge Base](/systems/knowledge-base.md)
