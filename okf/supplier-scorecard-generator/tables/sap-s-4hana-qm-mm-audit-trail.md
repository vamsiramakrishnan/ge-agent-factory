---
type: Data Entity
title: sap_s_4hana_qm_mm_audit_trail
description: Data entity sap_s_4hana_qm_mm_audit_trail owned by SAP S/4HANA QM/MM.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# sap_s_4hana_qm_mm_audit_trail

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

- Owned by [SAP S/4HANA QM/MM](/systems/sap-s-4hana-qm-mm.md)
