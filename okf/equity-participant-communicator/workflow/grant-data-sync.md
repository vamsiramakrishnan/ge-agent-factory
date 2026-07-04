---
type: Workflow Stage
title: Grant Data Sync
description: "Pull equity grant details, vesting schedules, exercise windows, and current valuations from Carta/Shareworks. Match with employee profile from Workday."
source_id: grant_data_sync
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Grant Data Sync

Pull equity grant details, vesting schedules, exercise windows, and current valuations from Carta/Shareworks. Match with employee profile from Workday.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_carta_carta_records](/tools/query-carta-carta-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_equity_participant_communicator_policy_handbook](/tools/lookup-equity-participant-communicator-policy-handbook.md)

Next: [Dashboard & Tax Generation](/workflow/dashboard-tax-generation.md)
