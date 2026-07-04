---
type: Data Entity
title: dow_jones_risk_compliance_records
description: "Data entity dow_jones_risk_compliance_records owned by Dow Jones Risk & Compliance."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# dow_jones_risk_compliance_records

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

- Owned by [Dow Jones Risk & Compliance](/systems/dow-jones-risk-compliance.md)
