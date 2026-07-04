---
type: Data Entity
title: policy_exceptions
description: Data entity policy_exceptions owned by SAP Concur.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# policy_exceptions

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

- Owned by [SAP Concur](/systems/sap-concur.md)
