---
type: Data Entity
title: circular_updates
description: Data entity circular_updates owned by Verisk ISO ERC.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# circular_updates

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| circular_id | seq | required |
| circular_type | enum | required; values: loss_cost_revision, rules_revision, forms_revision, stat_plan_change, advisory_notice_annual_reporting |
| line_of_business | enum | required; values: personal_auto, homeowners, commercial_property, workers_comp, general_liability, commercial_auto |
| affected_state | enum | required; values: TX, FL, CA, NY, IL, GA, PA, OH, NC, MI, multistate |
| release_date | date | required |
| proposed_effective_date | date | required |
| carrier_adoption_status | enum | required; values: adopted_as_filed, adopted_with_deviation, not_adopted, under_actuarial_review |
| doi_filing_required | boolean | required |
| impact_summary | lorem.sentence |  |
| actuarial_reviewer | person.fullName | required |

# Citations

- Owned by [Verisk ISO ERC](/systems/verisk-iso-erc.md)
