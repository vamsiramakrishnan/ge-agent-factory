---
type: Data Entity
title: transaction_risk_scores
description: Data entity transaction_risk_scores owned by NICE Actimize.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# transaction_risk_scores

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| transaction_id | number | required |
| model_version | enum | required; values: trs_champion_v3_1, trs_champion_v3_2, trs_challenger_v4_0 |
| risk_score | number | required |
| score_band | enum | required; values: low, medium, high, critical |
| velocity_rule_triggered | boolean | required |
| geolocation_anomaly | boolean | required |
| mule_account_indicator | boolean | required |
| scored_date | date | required |

# Citations

- Owned by [NICE Actimize](/systems/nice-actimize.md)
