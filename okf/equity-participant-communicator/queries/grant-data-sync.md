---
type: Query Capability
title: "Pull equity grant details, vesting schedules, exercise windows, and current v..."
description: "Pull equity grant details, vesting schedules, exercise windows, and current valuations from Carta/Shareworks. Match with employee profile from Workday."
source_id: "grant-data-sync"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull equity grant details, vesting schedules, exercise windows, and current valuations from Carta/Shareworks. Match with employee profile from Workday.

## Tools used

- [query_carta_carta_records](/tools/query-carta-carta-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_equity_participant_communicator_policy_handbook](/tools/lookup-equity-participant-communicator-policy-handbook.md)

## Runs in

- [grant_data_sync](/workflow/grant-data-sync.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Equity Participant Communicator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/equity-participant-communicator-end-to-end.md)

# Citations

- [Equity Participant Communicator Policy Handbook](/documents/equity-participant-communicator-policy-handbook.md)
