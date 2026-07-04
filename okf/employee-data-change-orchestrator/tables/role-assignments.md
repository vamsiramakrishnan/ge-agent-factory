---
type: Data Entity
title: role_assignments
description: Data entity role_assignments owned by Active Directory.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# role_assignments

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

- Owned by [Active Directory](/systems/active-directory.md)
