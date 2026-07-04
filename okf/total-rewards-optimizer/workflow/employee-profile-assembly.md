---
type: Workflow Stage
title: Employee Profile Assembly
description: "Aggregate current compensation, performance history, tenure, and benefits elections from Workday. Pull market positioning data from Mercer for the employee's role and geography."
source_id: employee_profile_assembly
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Employee Profile Assembly

Aggregate current compensation, performance history, tenure, and benefits elections from Workday. Pull market positioning data from Mercer for the employee's role and geography.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_mercer_mercer_records](/tools/query-mercer-mercer-records.md)

Next: [Package Scenario Modeling](/workflow/package-scenario-modeling.md)
