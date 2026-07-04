---
type: Query Capability
title: "Monitor job architecture, compensation band, and HRIS updates across Workday,..."
description: "Monitor job architecture, compensation band, and HRIS updates across Workday, SAP SuccessFactors, and Mercer. Detect changes that require cross-system synchronization."
source_id: "change-detection"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Monitor job architecture, compensation band, and HRIS updates across Workday, SAP SuccessFactors, and Mercer. Detect changes that require cross-system synchronization.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [query_mercer_mercer_records](/tools/query-mercer-mercer-records.md)
- [lookup_job_architecture_sync_agent_policy_handbook](/tools/lookup-job-architecture-sync-agent-policy-handbook.md)
- [action_workday_publish](/tools/action-workday-publish.md)

## Runs in

- [change_detection](/workflow/change-detection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Job Architecture Sync Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/job-architecture-sync-agent-end-to-end.md)

# Citations

- [Job Architecture Sync Agent Policy Handbook](/documents/job-architecture-sync-agent-policy-handbook.md)
