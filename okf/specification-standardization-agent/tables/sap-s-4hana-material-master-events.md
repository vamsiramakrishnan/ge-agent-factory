---
type: Data Entity
title: sap_s_4hana_material_master_events
description: Data entity sap_s_4hana_material_master_events owned by SAP S/4HANA Material Master.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# sap_s_4hana_material_master_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| sap_s_4hana_material_master_record_id | ref | required |

# Citations

- Owned by [SAP S/4HANA Material Master](/systems/sap-s-4hana-material-master.md)
