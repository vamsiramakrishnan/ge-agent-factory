---
type: Data Entity
title: rated_events
description: Data entity rated_events owned by Amdocs CES Billing.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# rated_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| event_id | number | required |
| subscriber_key | number | required |
| rated_amount_usd | float | required |
| rate_plan_code | enum | required; values: UNL_PLUS_5G, UNL_BASIC, PREPAID_15GB, IOT_M2M_POOLED, LEGACY_SHARE_10GB |
| guiding_status | enum | required; values: guided, suspense, rejected, rerated |
| zero_rated | boolean | required |
| tax_jurisdiction | enum | required; values: TX, NY, CA, IL, GA, FL |
| rating_date | date | required |
| rerate_count | number |  |
| billing_account_id | ref | required |

# Citations

- Owned by [Amdocs CES Billing](/systems/amdocs-ces-billing.md)
