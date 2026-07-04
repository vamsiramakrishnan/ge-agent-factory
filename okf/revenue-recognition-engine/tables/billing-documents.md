---
type: Data Entity
title: billing_documents
description: Data entity billing_documents owned by SAP S/4HANA SD/FI.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# billing_documents

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| source_record_id | seq | required |
| vendor | company.name | required |
| amount | float | required |
| currency | enum | required; values: USD, EUR, GBP, JPY |
| status | enum | required; values: draft, pending, approved, paid, rejected |
| created_at | date | required |
| due_date | date | required |

# Citations

- Owned by [SAP S/4HANA SD/FI](/systems/sap-s-4hana-sd-fi.md)
