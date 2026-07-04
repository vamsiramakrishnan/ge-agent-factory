---
type: Data Entity
title: industry_benchmarks_audit_trail
description: Data entity industry_benchmarks_audit_trail owned by Industry benchmarks.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# industry_benchmarks_audit_trail

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

- Owned by [Industry benchmarks](/systems/industry-benchmarks.md)
