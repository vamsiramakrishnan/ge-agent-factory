---
type: Data Entity
title: credit_memos
description: Data entity credit_memos owned by nCino Loan Origination.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# credit_memos

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| memo_number | number | required |
| application_number | number | required |
| borrower_name | company.name | required |
| global_cash_flow | float | required |
| policy_exception_count | number | required |
| guarantor_strength | enum | required; values: strong, adequate, marginal, unsupported |
| approval_authority | enum | required; values: rm_delegated, senior_credit_officer, credit_committee, board_dirloans |
| memo_date | date | required |
| annual_review_required | boolean | required |

# Citations

- Owned by [nCino Loan Origination](/systems/ncino-loan-origination.md)
