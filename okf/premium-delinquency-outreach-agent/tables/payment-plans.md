---
type: Data Entity
title: payment_plans
description: Data entity payment_plans owned by Guidewire BillingCenter.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# payment_plans

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| plan_id | seq | required |
| billing_account_number | seq | required |
| plan_type | enum | required; values: paid_in_full, two_pay_50_50, four_pay_quarterly, ten_pay, monthly_eft_12_pay |
| down_payment_pct | float | required |
| per_installment_fee | float | required |
| installments_remaining | number | required |
| next_installment_date | date |  |
| eft_enrolled | boolean | required |
| plan_status | enum | required; values: active, completed, defaulted_nonpay, rewritten_after_reinstatement |

# Citations

- Owned by [Guidewire BillingCenter](/systems/guidewire-billingcenter.md)
