---
type: Data Entity
title: capa_tracking_audit_trail
description: Data entity capa_tracking_audit_trail owned by CAPA Tracking.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# capa_tracking_audit_trail

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |

# Citations

- Owned by [CAPA Tracking](/systems/capa-tracking.md)
