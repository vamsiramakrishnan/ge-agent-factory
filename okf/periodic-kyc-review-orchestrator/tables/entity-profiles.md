---
type: Data Entity
title: entity_profiles
description: Data entity entity_profiles owned by Fenergo CLM.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# entity_profiles

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| profile_id | number | required |
| legal_name | company.name | required |
| entity_type | enum | required; values: individual, llc, c_corp, general_partnership, revocable_trust, money_services_business, nonprofit_501c3 |
| naics_risk_tier | enum | required; values: standard, elevated_monitoring, high_risk_program |
| country_of_domicile | enum | required; values: US, CA, GB, MX, KY, CH, AE |
| fincen_boi_verified | boolean | required |
| expected_monthly_volume | float | required |
| cash_intensive_business | boolean | required |
| profile_last_refreshed | date | required |

# Citations

- Owned by [Fenergo CLM](/systems/fenergo-clm.md)
