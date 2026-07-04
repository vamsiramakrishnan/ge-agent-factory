---
type: Data Entity
title: clearing_batches
description: Data entity clearing_batches owned by FIS Payments Hub.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# clearing_batches

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| batch_number | number | required |
| clearing_network | enum | required; values: fedach, epn, check_image_x9_37, fedwire_funds, rtp_network |
| batch_status | enum | required; values: open, balanced, transmitted, settled, rejected |
| item_count | number | required |
| total_debits | float | required |
| total_credits | float | required |
| cutoff_date | date | required |
| settlement_window | enum | required; values: same_day_window_1, same_day_window_2, same_day_window_3, next_day |
| rejected_item_count | number |  |

# Citations

- Owned by [FIS Payments Hub](/systems/fis-payments-hub.md)
