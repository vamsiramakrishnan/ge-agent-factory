---
type: Data Entity
title: policy_forms
description: Data entity policy_forms owned by Duck Creek Policy.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# policy_forms

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| form_id | seq | required |
| form_code | enum | required; values: HO_00_03_0322, PP_00_01_0918, CG_00_01_0413, CP_00_10_1012, CA_00_01_1120, WC_00_00_00_C, IL_00_17_1198 |
| form_type | enum | required; values: coverage_form, endorsement, declarations, conditions, statutory_notice, application |
| form_source | enum | required; values: iso_standard, iso_modified_deviation, proprietary, naic_model, state_mandated |
| filing_status | enum | required; values: filed_and_approved, filed_pending_doi, file_and_use_effective, use_and_file_pending, exempt_surplus_lines |
| edition_date | date | required |
| filing_state | enum | required; values: TX, FL, CA, NY, IL, GA, PA, OH, NC, MI, countrywide_multistate |
| mandatory_attachment | boolean | required |
| form_description | lorem.sentence |  |

# Citations

- Owned by [Duck Creek Policy](/systems/duck-creek-policy.md)
