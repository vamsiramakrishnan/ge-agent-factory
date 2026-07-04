---
type: Data Entity
title: online_orders
description: Data entity online_orders owned by Salesforce Commerce Cloud.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# online_orders

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| order_number | number | required |
| customer_email | internet.email | required |
| order_date | date | required |
| fulfillment_method | enum | required; values: ship_from_dc, ship_from_store, bopis, curbside, same_day_courier |
| order_total | float | required |
| line_count | number | required |
| promised_delivery_date | date | required |
| split_shipment_flag | boolean | required |
| order_status | enum | required; values: placed, picking, shipped, delivered, cancelled, returned |

# Citations

- Owned by [Salesforce Commerce Cloud](/systems/salesforce-commerce-cloud.md)
