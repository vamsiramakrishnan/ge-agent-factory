---
type: Source System
title: Workday
description: "Employee master data, lifecycle events, job changes"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Workday

Employee master data, lifecycle events, job changes

- **Protocol:** Workday REST
- **Local backing:** alloydb

# Schema

- [employees](/tables/employees.md)
- [positions](/tables/positions.md)
- [compensation_records](/tables/compensation-records.md)

## Tools using this system

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_employee_data_change_orchestrator_policy_handbook](/tools/lookup-employee-data-change-orchestrator-policy-handbook.md)
- [action_workday_update](/tools/action-workday-update.md)
