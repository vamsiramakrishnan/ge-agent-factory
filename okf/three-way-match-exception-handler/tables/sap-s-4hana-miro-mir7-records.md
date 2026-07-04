---
type: Data Entity
title: sap_s_4hana_miro_mir7_records
description: Data entity sap_s_4hana_miro_mir7_records owned by SAP S/4HANA (MIRO/MIR7).
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# sap_s_4hana_miro_mir7_records

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

- Owned by [SAP S/4HANA (MIRO/MIR7)](/systems/sap-s-4hana-miro-mir7.md)
