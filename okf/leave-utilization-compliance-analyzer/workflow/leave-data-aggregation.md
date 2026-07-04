---
type: Workflow Stage
title: Leave Data Aggregation
description: Sync all leave types and absence records from Workday across jurisdictions. Normalize leave categories and merge with employee demographics and org data.
source_id: leave_data_aggregation
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Leave Data Aggregation

Sync all leave types and absence records from Workday across jurisdictions. Normalize leave categories and merge with employee demographics and org data.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_leave_utilization_compliance_analyzer_policy_handbook](/tools/lookup-leave-utilization-compliance-analyzer-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)

Next: [Pattern & Anomaly Analysis](/workflow/pattern-anomaly-analysis.md)
