---
type: Data Entity
title: risk_reports
description: Data entity risk_reports owned by LexisNexis Risk Solutions.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# risk_reports

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| report_id | seq | required |
| policy_number | seq | required |
| report_type | enum | required; values: property_exterior_inspection, loss_control_survey, wind_mitigation_oir_b1_1802, protection_class_verification, replacement_cost_valuation, premium_audit_physical |
| inspection_vendor | company.name | required |
| iso_public_protection_class | number | required |
| hazard_grade | enum | required; values: low, moderate, elevated, severe_referral_required |
| open_recommendations | number | required |
| report_date | date | required |
| field_inspector | person.fullName | required |
| condition_narrative | lorem.sentence |  |

# Citations

- Owned by [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md)
