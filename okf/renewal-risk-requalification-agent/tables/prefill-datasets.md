---
type: Data Entity
title: prefill_datasets
description: Data entity prefill_datasets owned by LexisNexis Risk Solutions.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# prefill_datasets

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| prefill_id | seq | required |
| quote_number | seq | required |
| data_source | enum | required; values: clue_auto_7yr, clue_property_7yr, mvr_vendor_pull, vin_decode_symbol_lookup, property_characteristics_360value, credit_based_insurance_score |
| match_confidence | float | required |
| prior_losses_found | number | required |
| prior_carrier | company.name |  |
| insurance_score | number |  |
| fcra_adverse_action_triggered | boolean | required |
| retrieved_date | date | required |

# Citations

- Owned by [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md)
