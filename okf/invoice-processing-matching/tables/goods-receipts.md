---
type: Data Entity
title: goods_receipts
description: Data entity goods_receipts owned by SAP S/4HANA.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# goods_receipts

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| gr_number | seq | required |
| po_number | ref | required |
| vendor_id | ref | required |
| received_qty | number | required |
| receipt_date | date | required |
| status | enum | required; values: received, inspected, accepted, rejected |

# Citations

- Owned by [SAP S/4HANA](/systems/sap-s4hana.md)
