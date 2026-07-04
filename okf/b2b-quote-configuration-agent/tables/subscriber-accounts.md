---
type: Data Entity
title: subscriber_accounts
description: Data entity subscriber_accounts owned by Salesforce Communications Cloud.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# subscriber_accounts

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| subscriber_key | number | required |
| account_number | number | required |
| subscriber_name | person.fullName | required |
| service_type | enum | required; values: postpaid_wireless, prepaid_wireless, fiber_internet, fixed_wireless_access, iot_m2m, voice_landline |
| rate_plan | enum | required; values: unlimited_premium, unlimited_welcome, prepaid_flex, fiber_1gig, fiber_300m, iot_pooled |
| port_protection_enabled | boolean | required |
| tenure_months | number | required |
| churn_risk_score | float | required |
| activation_date | date | required |

# Citations

- Owned by [Salesforce Communications Cloud](/systems/salesforce-communications-cloud.md)
