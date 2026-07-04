---
type: Data Entity
title: modules
description: Data entity modules owned by Terraform.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# modules

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

- Owned by [Terraform](/systems/terraform.md)
