---
type: Data Entity
title: insurance_cert_management_records
description: Data entity insurance_cert_management_records owned by Insurance Cert Management.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# insurance_cert_management_records

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

- Owned by [Insurance Cert Management](/systems/insurance-cert-management.md)
