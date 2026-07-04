---
type: Query Capability
title: "Execute validated changes across Workday, Active Directory, payroll, and bene..."
description: "Execute validated changes across Workday, Active Directory, payroll, and benefits systems in the correct sequence. Handle rollback on partial failures."
source_id: "multi-system-propagation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Execute validated changes across Workday, Active Directory, payroll, and benefits systems in the correct sequence. Handle rollback on partial failures.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_active_directory_directory_users](/tools/query-active-directory-directory-users.md)
- [lookup_employee_data_change_orchestrator_policy_handbook](/tools/lookup-employee-data-change-orchestrator-policy-handbook.md)
- [action_workday_update](/tools/action-workday-update.md)

## Runs in

- [multi_system_propagation](/workflow/multi-system-propagation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Employee Data Change Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/employee-data-change-orchestrator-end-to-end.md)

# Citations

- [Employee Data Change Orchestrator Policy Handbook](/documents/employee-data-change-orchestrator-policy-handbook.md)
