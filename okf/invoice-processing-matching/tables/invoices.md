---
type: Data Entity
title: invoices
description: Data entity invoices owned by SAP S/4HANA.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# invoices

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| basware_invoice_id | seq | required |
| vendor_id | ref | required |
| po_number | ref |  |
| amount | number | required |
| currency | enum | required; values: USD, EUR, GBP |
| invoice_date | date | required |
| status | enum | required; values: received, matched, posted, exception |

# Citations

- Owned by [SAP S/4HANA](/systems/sap-s4hana.md)
