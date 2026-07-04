---
type: Data Entity
title: edit_history
description: Data entity edit_history owned by Google Sheets.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# edit_history

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| sheet_id | ref | required |

# Citations

- Owned by [Google Sheets](/systems/google-sheets.md)
