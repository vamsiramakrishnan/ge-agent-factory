---
type: Data Entity
title: investigation_cases
description: Data entity investigation_cases owned by NICE Actimize.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# investigation_cases

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| case_number | number | required |
| subject_name | person.fullName | required |
| typology | enum | required; values: structuring, funnel_account, trade_based_laundering, human_trafficking_indicators, fraud_referral, terrorist_financing, elder_exploitation_referral |
| sar_decision | enum | required; values: sar_filed, no_sar_warranted, pending_review, continuing_activity_supplemental |
| ctr_related | boolean | required |
| case_opened_date | date | required |
| filing_deadline_date | date | required |
| aggregate_suspicious_amount | float | required |
| investigator_email | internet.email | required |

# Citations

- Owned by [NICE Actimize](/systems/nice-actimize.md)
