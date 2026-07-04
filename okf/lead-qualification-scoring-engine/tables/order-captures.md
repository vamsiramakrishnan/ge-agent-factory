---
type: Data Entity
title: order_captures
description: Data entity order_captures owned by Salesforce Communications Cloud.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# order_captures

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| capture_id | number | required |
| quote_number | number | required |
| sales_channel | enum | required; values: retail_store, telesales, web_self_serve, door_to_door, b2b_direct, dealer_indirect |
| customer_email | internet.email | required |
| byod_flag | boolean | required |
| device_financing | enum | values: eip_24_month, eip_36_month, paid_in_full, none |
| tpv_completed | boolean | required |
| esign_completed | boolean | required |
| capture_date | date | required |

# Citations

- Owned by [Salesforce Communications Cloud](/systems/salesforce-communications-cloud.md)
