---
type: Workflow Stage
title: Pipeline Data Collection
description: Pull candidate pipeline data from Greenhouse with demographic information at each funnel stage. Join with Workday requisition data for hiring manager and role context.
source_id: pipeline_data_collection
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pipeline Data Collection

Pull candidate pipeline data from Greenhouse with demographic information at each funnel stage. Join with Workday requisition data for hiring manager and role context.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_inclusive_hiring_audit_policy_handbook](/tools/lookup-inclusive-hiring-audit-policy-handbook.md)

Next: [Intervention Recommendations](/workflow/intervention-recommendations.md)
