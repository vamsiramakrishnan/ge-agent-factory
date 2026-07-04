---
type: Proof Obligation
title: "Golden eval obligation — Run the HR Tech Stack Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-hr-tech-stack-intelligence-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the HR Tech Stack Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [hr-tech-stack-intelligence-end-to-end](/tests/hr-tech-stack-intelligence-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_google_admin_google_admin_records](/tools/query-google-admin-google-admin-records.md)
- [query_license_manager_license_manager_records](/tools/query-license-manager-license-manager-records.md)
- [lookup_hr_tech_stack_intelligence_policy_handbook](/tools/lookup-hr-tech-stack-intelligence-policy-handbook.md)
- [action_workday_recommend](/tools/action-workday-recommend.md)

## Entities that must be referenced

- employees
- tickets
- google_admin_records
- license_manager_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [hr-tech-stack-intelligence-policy-handbook](/documents/hr-tech-stack-intelligence-policy-handbook.md)
