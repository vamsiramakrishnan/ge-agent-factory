---
type: Data Entity
title: purchase_orders
description: Data entity purchase_orders owned by SAP S/4HANA.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# purchase_orders

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| po_number | seq | required; primary key |
| vendor_id | ref | required |
| amount | number | required |
| currency | enum | required; values: USD, EUR, GBP |
| po_date | date | required |
| line_items | number | required |
| status | enum | required; values: open, partial_received, fully_received, closed |

# Citations

- Owned by [SAP S/4HANA](/systems/sap-s4hana.md)
