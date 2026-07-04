---
type: Data Entity
title: sap_qm_qm01_qm02_events
description: Data entity sap_qm_qm01_qm02_events owned by SAP QM (QM01/QM02).
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# sap_qm_qm01_qm02_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| sap_qm_qm01_qm02_record_id | ref | required |

# Citations

- Owned by [SAP QM (QM01/QM02)](/systems/sap-qm-qm01-qm02.md)
