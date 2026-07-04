---
type: Data Entity
title: client_households
description: Data entity client_households owned by Salesforce Financial Services Cloud.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# client_households

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| household_id | number | required |
| primary_client_name | person.fullName | required |
| total_aum | float | required |
| risk_tolerance | enum | required; values: conservative, moderately_conservative, moderate, moderately_aggressive, aggressive |
| investment_objective | enum | required; values: capital_preservation, income, growth_and_income, growth, speculation |
| accredited_investor | boolean | required |
| reg_bi_crs_delivered | boolean | required |
| primary_advisor | person.fullName | required |
| last_annual_review_date | date | required |

# Citations

- Owned by [Salesforce Financial Services Cloud](/systems/salesforce-financial-services-cloud.md)
