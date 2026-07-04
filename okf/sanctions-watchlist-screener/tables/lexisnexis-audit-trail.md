---
type: Data Entity
title: lexisnexis_audit_trail
description: Data entity lexisnexis_audit_trail owned by LexisNexis.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# lexisnexis_audit_trail

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

- Owned by [LexisNexis](/systems/lexisnexis.md)
