---
type: Source System
title: Workday
description: "Termination events, employee records, final pay calculation"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Workday

Termination events, employee records, final pay calculation

- **Protocol:** Workday REST
- **Local backing:** alloydb

# Schema

- [employees](/tables/employees.md)
- [positions](/tables/positions.md)
- [compensation_records](/tables/compensation-records.md)

## Tools using this system

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_offboarding_orchestration_policy_handbook](/tools/lookup-offboarding-orchestration-policy-handbook.md)
- [action_workday_provision](/tools/action-workday-provision.md)
