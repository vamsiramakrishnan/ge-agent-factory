---
type: Data Entity
title: siu_referrals
description: Data entity siu_referrals owned by FRISS Fraud Detection.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# siu_referrals

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| referral_id | seq | required |
| claim_number | seq | required |
| referral_source | enum | required; values: adjuster_referral, predictive_model_threshold, nicb_alert, iso_claimsearch_hit, tip_hotline, doi_fraud_bureau_bulletin |
| suspected_fraud_type | enum | required; values: staged_accident, exaggerated_injury_buildup, provider_billing_fraud, arson_suspected, phantom_vehicle_theft, application_misrepresentation, contractor_aob_abuse |
| referral_status | enum | required; values: received, accepted_for_investigation, active_investigation, referred_to_nicb, reported_to_doi_fraud_bureau, closed_unfounded, closed_substantiated |
| state_mandatory_reporting_required | boolean | required |
| assigned_investigator | person.fullName | required |
| referral_date | date | required |
| days_open | number | required |

# Citations

- Owned by [FRISS Fraud Detection](/systems/friss-fraud-detection.md)
