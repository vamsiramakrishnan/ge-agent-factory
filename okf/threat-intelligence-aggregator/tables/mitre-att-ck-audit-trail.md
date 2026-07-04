---
type: Data Entity
title: mitre_att_ck_audit_trail
description: "Data entity mitre_att_ck_audit_trail owned by MITRE ATT&CK."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# mitre_att_ck_audit_trail

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

- Owned by [MITRE ATT&CK](/systems/mitre-att-ck.md)
