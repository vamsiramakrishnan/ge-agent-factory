---
type: Data Entity
title: kyc_cases
description: Data entity kyc_cases owned by Fenergo CLM.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# kyc_cases

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| case_id | number | required |
| customer_name | company.name | required |
| case_type | enum | required; values: onboarding_cdd, periodic_review, event_driven_refresh, remediation_lookback |
| cdd_risk_rating | enum | required; values: low, medium, high, prohibited |
| edd_required | boolean | required |
| beneficial_owner_count | number | required |
| pep_exposure | boolean | required |
| next_review_date | date | required |
| case_status | enum | required; values: open, pending_documents, qc_review, approved, relationship_exited |

# Citations

- Owned by [Fenergo CLM](/systems/fenergo-clm.md)
