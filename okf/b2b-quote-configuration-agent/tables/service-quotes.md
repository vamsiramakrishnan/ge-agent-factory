---
type: Data Entity
title: service_quotes
description: Data entity service_quotes owned by Salesforce Communications Cloud.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# service_quotes

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| quote_number | number | required |
| business_name | company.name | required |
| product_bundle | enum | required; values: 5g_unlimited_family, fiber_1gig_wifi, enterprise_dia_100m, managed_sdwan, iot_fleet_500_sims, ucaas_seats_bundle |
| mrr_usd | float | required |
| contract_term | enum | required; values: month_to_month, term_12, term_24, term_36 |
| discount_pct | float | required |
| credit_check_status | enum | required; values: approved, deposit_required, declined, pending |
| serviceability_confirmed | boolean | required |
| valid_until | date | required |

# Citations

- Owned by [Salesforce Communications Cloud](/systems/salesforce-communications-cloud.md)
