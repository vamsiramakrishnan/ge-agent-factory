---
type: Query Capability
title: "Aggregate current compensation, performance history, tenure, and benefits ele..."
description: "Aggregate current compensation, performance history, tenure, and benefits elections from Workday. Pull market positioning data from Mercer for the employee's role and geography."
source_id: "employee-profile-assembly"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate current compensation, performance history, tenure, and benefits elections from Workday. Pull market positioning data from Mercer for the employee's role and geography.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_mercer_mercer_records](/tools/query-mercer-mercer-records.md)

## Runs in

- [employee_profile_assembly](/workflow/employee-profile-assembly.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Total Rewards Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/total-rewards-optimizer-end-to-end.md)

# Citations

- [Total Rewards Optimizer Policy Handbook](/documents/total-rewards-optimizer-policy-handbook.md)
