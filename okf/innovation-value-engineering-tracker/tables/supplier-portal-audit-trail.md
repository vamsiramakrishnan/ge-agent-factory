---
type: Data Entity
title: supplier_portal_audit_trail
description: Data entity supplier_portal_audit_trail owned by Supplier Portal.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# supplier_portal_audit_trail

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| name | company.name | required |
| category | enum | required; values: IT, Consulting, Manufacturing, Logistics, Facilities, Marketing |
| rating | number | required |
| annual_spend | number | required |
| risk_score | enum | required; values: low, medium, high |
| status | enum | required; values: active, pending_review, terminated |
| onboarded_on | date | required |

# Citations

- Owned by [Supplier Portal](/systems/supplier-portal.md)
