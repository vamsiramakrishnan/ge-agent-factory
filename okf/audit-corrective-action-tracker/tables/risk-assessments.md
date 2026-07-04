---
type: Data Entity
title: risk_assessments
description: Data entity risk_assessments owned by SAP GRC.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# risk_assessments

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| name | lorem.sentence | required |
| status | enum | required; values: open, in_progress, certified, exception |
| owner | person.fullName | required |
| match_rate | float | required |
| last_run | date | required |

# Citations

- Owned by [SAP GRC](/systems/sap-grc.md)
