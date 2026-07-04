---
type: Data Entity
title: mitre_att_ck_records
description: "Data entity mitre_att_ck_records owned by MITRE ATT&CK."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# mitre_att_ck_records

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

- Owned by [MITRE ATT&CK](/systems/mitre-att-ck.md)
