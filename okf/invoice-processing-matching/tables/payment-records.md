---
type: Data Entity
title: payment_records
description: Data entity payment_records owned by SAP S/4HANA.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# payment_records

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| invoice_id | ref | required |
| miro_document_number | seq | required |
| payment_queue_id | seq | required |
| audit_trail | lorem.sentence | required |
| posted_date | date | required |

# Citations

- Owned by [SAP S/4HANA](/systems/sap-s4hana.md)
