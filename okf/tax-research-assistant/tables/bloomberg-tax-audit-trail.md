---
type: Data Entity
title: bloomberg_tax_audit_trail
description: Data entity bloomberg_tax_audit_trail owned by Bloomberg Tax.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# bloomberg_tax_audit_trail

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

- Owned by [Bloomberg Tax](/systems/bloomberg-tax.md)
