---
type: Data Entity
title: insurance_cert_management_events
description: Data entity insurance_cert_management_events owned by Insurance Cert Management.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# insurance_cert_management_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| insurance_cert_management_record_id | ref | required |

# Citations

- Owned by [Insurance Cert Management](/systems/insurance-cert-management.md)
