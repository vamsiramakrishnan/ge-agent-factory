---
type: Data Entity
title: capa_actions
description: Data entity capa_actions owned by SAP S/4HANA QM.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# capa_actions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| capa_number | number | required |
| source | enum | required; values: internal_audit, customer_complaint, nc_escalation, management_review, regulatory_finding |
| action_type | enum | required; values: corrective, preventive |
| root_cause_method | enum | required; values: five_why, fishbone, eight_d, fault_tree, is_is_not |
| status | enum | required; values: open, containment, root_cause_analysis, implementation, effectiveness_check, closed |
| due_date | date | required |
| effectiveness_verified | boolean | required |
| owner_name | person.fullName | required |
| days_open | number |  |

# Citations

- Owned by [SAP S/4HANA QM](/systems/sap-s-4hana-qm.md)
