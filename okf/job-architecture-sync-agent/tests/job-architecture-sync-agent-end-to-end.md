---
type: Eval Scenario
title: Run the Job Architecture Sync Agent workflow for the current period. Cite the...
description: "Run the Job Architecture Sync Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "job-architecture-sync-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Job Architecture Sync Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [change-detection](/queries/change-detection.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [query_mercer_mercer_records](/tools/query-mercer-mercer-records.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [lookup_job_architecture_sync_agent_policy_handbook](/tools/lookup-job-architecture-sync-agent-policy-handbook.md)
- [action_workday_publish](/tools/action-workday-publish.md)

## Success rubric

Action publish executed against Workday, with audit-trail entry and Comp Manager notified of outcomes.

# Citations

- [Job Architecture Sync Agent Policy Handbook](/documents/job-architecture-sync-agent-policy-handbook.md)
