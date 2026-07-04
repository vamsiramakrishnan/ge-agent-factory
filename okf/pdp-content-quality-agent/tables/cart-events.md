---
type: Data Entity
title: cart_events
description: Data entity cart_events owned by Salesforce Commerce Cloud.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# cart_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| session_id | number | required |
| sku | number | required |
| event_type | enum | required; values: add_to_cart, remove_from_cart, save_for_later, begin_checkout, abandon_cart, complete_purchase |
| event_date | date | required |
| cart_value | float | required |
| device_type | enum | required; values: mobile_web, desktop, native_app, tablet |
| promo_code_applied | boolean | required |
| customer_email | internet.email |  |

# Citations

- Owned by [Salesforce Commerce Cloud](/systems/salesforce-commerce-cloud.md)
