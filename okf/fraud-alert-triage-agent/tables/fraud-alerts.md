---
type: Data Entity
title: fraud_alerts
description: Data entity fraud_alerts owned by NICE Actimize.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# fraud_alerts

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| alert_id | number | required |
| account_number | number | required |
| alert_type | enum | required; values: card_not_present, check_kiting, counterfeit_check, account_takeover, elder_financial_exploitation, p2p_payment_scam, business_email_compromise_wire |
| fraud_risk_score | number | required |
| alert_status | enum | required; values: new, in_review, confirmed_fraud, false_positive, closed_no_action |
| amount_at_risk | float | required |
| reg_e_claim_filed | boolean | required |
| alert_date | date | required |
| assigned_analyst | person.fullName | required |

# Citations

- Owned by [NICE Actimize](/systems/nice-actimize.md)
