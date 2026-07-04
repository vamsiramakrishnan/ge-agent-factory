---
type: Data Entity
title: vendors
description: Data entity vendors owned by SAP S/4HANA MM (ME21N).
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# vendors

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

- Owned by [SAP S/4HANA MM (ME21N)](/systems/sap-s-4hana-mm-me21n.md)
