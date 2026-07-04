---
type: Data Entity
title: premium_invoices
description: Data entity premium_invoices owned by Guidewire BillingCenter.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# premium_invoices

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| invoice_number | seq | required |
| billing_account_number | seq | required |
| installment_number | number | required |
| invoice_status | enum | required; values: issued, paid, partially_paid, past_due, cancelled_flat, written_off |
| premium_amount | float | required |
| installment_fee | float | required |
| state_taxes_surcharges | float | required |
| due_date | date | required |
| equity_date | date |  |

# Citations

- Owned by [Guidewire BillingCenter](/systems/guidewire-billingcenter.md)
