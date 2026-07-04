---
type: Data Entity
title: google_document_ai_events
description: Data entity google_document_ai_events owned by Google Document AI.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# google_document_ai_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| title | lorem.sentence | required |
| owner | person.fullName | required |
| status | enum | required; values: draft, review, published, archived |
| last_updated | date | required |
| google_document_ai_record_id | ref | required |

# Citations

- Owned by [Google Document AI](/systems/google-document-ai.md)
