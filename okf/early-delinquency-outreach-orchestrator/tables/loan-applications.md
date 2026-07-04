---
type: Data Entity
title: loan_applications
description: Data entity loan_applications owned by nCino Loan Origination.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# loan_applications

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| application_number | number | required |
| product_type | enum | required; values: term_loan, revolver, cre_mortgage, sba_7a, equipment_finance |
| requested_amount | float | required |
| dscr | float | required |
| ltv | float | required |
| risk_rating | enum | required; values: 1, 2, 3, 4, 5, 6, 7, 8 |
| decision_status | enum | required; values: submitted, underwriting, conditional_approval, approved, declined, withdrawn |
| adverse_action_sent | boolean | required |
| relationship_manager | person.fullName | required |

# Citations

- Owned by [nCino Loan Origination](/systems/ncino-loan-origination.md)
