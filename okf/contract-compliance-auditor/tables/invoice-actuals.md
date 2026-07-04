---
type: Data Entity
title: invoice_actuals
description: Data entity invoice_actuals owned by SAP S/4HANA.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# invoice_actuals

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| contract_id | ref | required |
| vendor_id | ref | required |
| amount | number | required |
| invoiced_at | date.recent | required |

# Citations

- Owned by [SAP S/4HANA](/systems/sap-s4hana.md)
