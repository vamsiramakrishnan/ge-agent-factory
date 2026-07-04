---
type: Data Entity
title: share_events
description: Data entity share_events owned by SharePoint/Google Drive.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# share_events

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

- Owned by [SharePoint/Google Drive](/systems/sharepoint-google-drive.md)
