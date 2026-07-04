---
type: Data Entity
title: cmrt_crt_questionnaires_audit_trail
description: Data entity cmrt_crt_questionnaires_audit_trail owned by CMRT/CRT Questionnaires.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# cmrt_crt_questionnaires_audit_trail

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

- Owned by [CMRT/CRT Questionnaires](/systems/cmrt-crt-questionnaires.md)
