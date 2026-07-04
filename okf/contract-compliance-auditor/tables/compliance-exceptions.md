---
type: Data Entity
title: compliance_exceptions
description: Data entity compliance_exceptions owned by Icertis.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# compliance_exceptions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| contract_id | ref | required |
| exception_type | enum | required; values: overcharge, rebate_cliff, formula_violation, threshold_miss |
| financial_impact | number | required |
| status | enum | required; values: open, escalated, resolved |

# Citations

- Owned by [Icertis](/systems/icertis.md)
