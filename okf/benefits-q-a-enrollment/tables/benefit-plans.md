---
type: Data Entity
title: benefit_plans
description: Data entity benefit_plans owned by Benefits Platform.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# benefit_plans

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| carrier | enum | required; values: Aetna, Cigna, UnitedHealthcare, Kaiser |
| plan_name | enum | required; values: Gold PPO, Standard PPO, Silver HMO, Bronze HSA |
| coverage_tier | enum | required; values: employee_only, employee_spouse, family |
| monthly_premium | number | required |
| deductible | number | required |

# Citations

- Owned by [Benefits Platform](/systems/benefits-platform.md)
