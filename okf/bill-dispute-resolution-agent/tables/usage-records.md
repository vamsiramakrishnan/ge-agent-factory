---
type: Data Entity
title: usage_records
description: Data entity usage_records owned by Amdocs CES Billing.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# usage_records

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| subscriber_key | number | required |
| event_type | enum | required; values: data, voice, sms, roaming_data, m2m |
| units | float | required |
| rating_group | number | required |
| charging_id | number | required |
| mediation_batch | number | required |
| event_date | date | required |
| roaming_partner | enum | values: none, telefonica, vodafone, rogers, telcel |
| duplicate_suspect | boolean |  |

# Citations

- Owned by [Amdocs CES Billing](/systems/amdocs-ces-billing.md)
