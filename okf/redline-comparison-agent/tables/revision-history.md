---
type: Data Entity
title: revision_history
description: Data entity revision_history owned by Google Docs.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# revision_history

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| document_id | ref | required |

# Citations

- Owned by [Google Docs](/systems/google-docs.md)
