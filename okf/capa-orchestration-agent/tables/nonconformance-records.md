---
type: Data Entity
title: nonconformance_records
description: Data entity nonconformance_records owned by SAP S/4HANA QM.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# nonconformance_records

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| nc_number | number | required |
| defect_code | enum | required; values: dimensional, surface_finish, contamination, missing_operation, wrong_material, documentation |
| severity | enum | required; values: critical, major, minor |
| disposition | enum | required; values: use_as_is, rework, repair, scrap, return_to_vendor |
| quantity_affected | number | required |
| containment_complete | boolean | required |
| mrb_required | boolean | required |
| detected_date | date | required |
| detected_by | person.fullName | required |

# Citations

- Owned by [SAP S/4HANA QM](/systems/sap-s-4hana-qm.md)
