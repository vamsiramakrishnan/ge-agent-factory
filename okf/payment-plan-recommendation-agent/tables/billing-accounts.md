---
type: Data Entity
title: billing_accounts
description: Data entity billing_accounts owned by Guidewire BillingCenter.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# billing_accounts

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| billing_account_number | seq | required |
| policy_number | seq | required |
| bill_type | enum | required; values: direct_bill, agency_bill, list_bill, mortgagee_bill |
| account_status | enum | required; values: current, past_due, in_statutory_grace_period, pending_cancel_nonpay, cancelled_nonpay, paid_in_full |
| current_balance | float | required |
| past_due_amount | float | required |
| autopay_eft_enrolled | boolean | required |
| nsf_returns_last_12mo | number | required |
| last_payment_date | date |  |
| account_holder | person.fullName | required |

# Citations

- Owned by [Guidewire BillingCenter](/systems/guidewire-billingcenter.md)
