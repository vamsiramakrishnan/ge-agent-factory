---
type: Data Entity
title: eligibility_rules
description: Data entity eligibility_rules owned by Benefits Platform.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# eligibility_rules

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| name | lorem.sentence | required |
| category | enum | required; values: compliance, operational, financial, security |
| owner | person.fullName | required |
| status | enum | required; values: active, draft, retired |
| last_updated | date | required |

# Citations

- Owned by [Benefits Platform](/systems/benefits-platform.md)
