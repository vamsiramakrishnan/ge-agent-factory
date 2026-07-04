---
type: Data Entity
title: folder_permissions
description: Data entity folder_permissions owned by SharePoint/Google Drive.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# folder_permissions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| source_record_id | seq | required |
| status | enum | required; values: active, pending, closed |
| owner | person.fullName | required |
| created_at | date | required |
| notes | lorem.sentence |  |

# Citations

- Owned by [SharePoint/Google Drive](/systems/sharepoint-google-drive.md)
