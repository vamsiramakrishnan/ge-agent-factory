---
type: Proof Obligation
title: "Golden eval obligation — Run the Employee Data Change Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-employee-data-change-orchestrator-end-to-end"
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

# Golden eval obligation — Run the Employee Data Change Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [employee-data-change-orchestrator-end-to-end](/tests/employee-data-change-orchestrator-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_active_directory_directory_users](/tools/query-active-directory-directory-users.md)
- [lookup_employee_data_change_orchestrator_policy_handbook](/tools/lookup-employee-data-change-orchestrator-policy-handbook.md)
- [action_workday_update](/tools/action-workday-update.md)

## Entities that must be referenced

- employees
- employee_records
- tickets
- directory_users

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute update without two-system evidence

# Citations

- [employee-data-change-orchestrator-policy-handbook](/documents/employee-data-change-orchestrator-policy-handbook.md)
