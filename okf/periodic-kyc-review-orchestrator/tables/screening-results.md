---
type: Data Entity
title: screening_results
description: Data entity screening_results owned by Fenergo CLM.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# screening_results

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| screening_id | number | required |
| case_id | number | required |
| list_source | enum | required; values: ofac_sdn, ofac_ns_cmic, eu_consolidated, un_1267_committee, hmt_uk_sanctions, pep_database, adverse_media |
| fuzzy_match_score | number | required |
| hit_type | enum | required; values: true_match, false_positive, pending_analyst_review |
| screened_party_name | person.fullName | required |
| disposition | enum | required; values: cleared, blocked_property, payment_rejected, pending |
| fincen_314a_match | boolean | required |
| disposition_date | date |  |

# Citations

- Owned by [Fenergo CLM](/systems/fenergo-clm.md)
