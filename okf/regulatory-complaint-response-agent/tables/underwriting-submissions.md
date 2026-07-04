---
type: Data Entity
title: underwriting_submissions
description: Data entity underwriting_submissions owned by Guidewire PolicyCenter.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# underwriting_submissions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| submission_id | seq | required |
| acord_application_form | enum | required; values: ACORD_125_commercial_app, ACORD_126_gl_section, ACORD_130_workers_comp, ACORD_140_property_section, ACORD_127_business_auto |
| insured_name | company.name | required |
| producing_broker | company.name | required |
| naics_code | number | required |
| total_insured_value | float | required |
| requested_effective_date | date | required |
| submission_status | enum | required; values: received, in_triage, with_underwriter, quoted, bound, declined_appetite, blocked_ofac_review |
| loss_runs_received_5yr | boolean | required |
| assigned_underwriter | person.fullName | required |

# Citations

- Owned by [Guidewire PolicyCenter](/systems/guidewire-policycenter.md)
