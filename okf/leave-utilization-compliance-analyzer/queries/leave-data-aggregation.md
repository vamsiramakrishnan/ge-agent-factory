---
type: Query Capability
title: Sync all leave types and absence records from Workday across jurisdictions. N...
description: Sync all leave types and absence records from Workday across jurisdictions. Normalize leave categories and merge with employee demographics and org data.
source_id: "leave-data-aggregation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Sync all leave types and absence records from Workday across jurisdictions. Normalize leave categories and merge with employee demographics and org data.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_leave_utilization_compliance_analyzer_policy_handbook](/tools/lookup-leave-utilization-compliance-analyzer-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)

## Runs in

- [leave_data_aggregation](/workflow/leave-data-aggregation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Leave Utilization & Compliance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/leave-utilization-compliance-analyzer-end-to-end.md)

# Citations

- [Leave Utilization & Compliance Analyzer Policy Handbook](/documents/leave-utilization-compliance-analyzer-policy-handbook.md)
