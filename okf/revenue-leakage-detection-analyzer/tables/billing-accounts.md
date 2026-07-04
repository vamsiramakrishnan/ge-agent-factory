---
type: Data Entity
title: billing_accounts
description: Data entity billing_accounts owned by Amdocs CES Billing.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# billing_accounts

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| account_number | number | required |
| account_status | enum | required; values: active, suspended_nonpay, collections, final_billed, written_off |
| bill_cycle_day | number | required |
| payment_method | enum | required; values: autopay_card, autopay_ach, ebill_manual, paper_invoice |
| balance_due_usd | float | required |
| past_due_amount_usd | float | required |
| credit_class | enum | required; values: class_a_no_deposit, class_b_standard, class_c_deposit_held, class_d_prepay_only |
| dunning_status | enum | required; values: none, reminder_sent, soft_suspend, hard_suspend, agency_placed |
| last_invoice_date | date | required |

# Citations

- Owned by [Amdocs CES Billing](/systems/amdocs-ces-billing.md)
