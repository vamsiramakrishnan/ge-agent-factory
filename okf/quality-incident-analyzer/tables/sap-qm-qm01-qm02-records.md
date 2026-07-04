---
type: Data Entity
title: sap_qm_qm01_qm02_records
description: Data entity sap_qm_qm01_qm02_records owned by SAP QM (QM01/QM02).
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# sap_qm_qm01_qm02_records

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

- Owned by [SAP QM (QM01/QM02)](/systems/sap-qm-qm01-qm02.md)
