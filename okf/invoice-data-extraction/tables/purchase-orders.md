---
type: Data Entity
title: purchase_orders
description: Data entity purchase_orders owned by SAP S/4HANA.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# purchase_orders

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| vendor_id | ref | required |
| po_number | text | required |
| amount | number | required |
| status | enum | required; values: open, partially_invoiced, fully_invoiced, closed |

# Citations

- Owned by [SAP S/4HANA](/systems/sap-s4hana.md)
