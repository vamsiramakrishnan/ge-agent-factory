---
type: Eval Scenario
title: Run the Employee Data Change Orchestrator workflow for the current period. Ci...
description: "Run the Employee Data Change Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "employee-data-change-orchestrator-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Employee Data Change Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [multi-system-propagation](/queries/multi-system-propagation.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_active_directory_directory_users](/tools/query-active-directory-directory-users.md)
- [lookup_employee_data_change_orchestrator_policy_handbook](/tools/lookup-employee-data-change-orchestrator-policy-handbook.md)
- [action_workday_update](/tools/action-workday-update.md)

## Success rubric

Action update executed against Workday, with audit-trail entry and HR Ops Lead notified of outcomes.

# Citations

- [Employee Data Change Orchestrator Policy Handbook](/documents/employee-data-change-orchestrator-policy-handbook.md)
