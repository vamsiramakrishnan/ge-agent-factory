---
type: Workflow Stage
title: Change Detection
description: "Monitor job architecture, compensation band, and HRIS updates across Workday, SAP SuccessFactors, and Mercer. Detect changes that require cross-system synchronization."
source_id: change_detection
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Change Detection

Monitor job architecture, compensation band, and HRIS updates across Workday, SAP SuccessFactors, and Mercer. Detect changes that require cross-system synchronization.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [query_mercer_mercer_records](/tools/query-mercer-mercer-records.md)
- [lookup_job_architecture_sync_agent_policy_handbook](/tools/lookup-job-architecture-sync-agent-policy-handbook.md)
- [action_workday_publish](/tools/action-workday-publish.md)

Next: [Cross-Validation](/workflow/cross-validation.md)
