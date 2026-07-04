---
type: Data Entity
title: financial_accounts
description: Data entity financial_accounts owned by Salesforce Financial Services Cloud.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# financial_accounts

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| account_number | number | required |
| household_id | number | required |
| registration_type | enum | required; values: individual_brokerage, joint_tenants_wros, ira_traditional, ira_roth, rollover_401k, ugma_utma, revocable_trust |
| market_value | float | required |
| cash_balance | float | required |
| margin_enabled | boolean | required |
| discretionary_managed | boolean | required |
| opened_date | date | required |

# Citations

- Owned by [Salesforce Financial Services Cloud](/systems/salesforce-financial-services-cloud.md)
