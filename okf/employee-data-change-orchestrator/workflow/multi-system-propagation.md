---
type: Workflow Stage
title: "Multi-System Propagation"
description: "Execute validated changes across Workday, Active Directory, payroll, and benefits systems in the correct sequence. Handle rollback on partial failures."
source_id: multi_system_propagation
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Multi-System Propagation

Execute validated changes across Workday, Active Directory, payroll, and benefits systems in the correct sequence. Handle rollback on partial failures.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_active_directory_directory_users](/tools/query-active-directory-directory-users.md)
- [lookup_employee_data_change_orchestrator_policy_handbook](/tools/lookup-employee-data-change-orchestrator-policy-handbook.md)
- [action_workday_update](/tools/action-workday-update.md)

Next: [Audit & Confirmation](/workflow/audit-confirmation.md)
