---
type: Data Entity
title: audit_trails
description: Data entity audit_trails owned by DocuSign.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# audit_trails

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| envelope_id | ref | required |

# Citations

- Owned by [DocuSign](/systems/docusign.md)
