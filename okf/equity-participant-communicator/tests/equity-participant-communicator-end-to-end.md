---
type: Eval Scenario
title: Run the Equity Participant Communicator workflow for the current period. Cite...
description: "Run the Equity Participant Communicator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "equity-participant-communicator-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Equity Participant Communicator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [grant-data-sync](/queries/grant-data-sync.md)

## Mechanisms to call

- [query_e_trade_e_trade_records](/tools/query-e-trade-e-trade-records.md)
- [query_carta_carta_records](/tools/query-carta-carta-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_gmail_messages](/tools/query-gmail-messages.md)
- [lookup_equity_participant_communicator_policy_handbook](/tools/lookup-equity-participant-communicator-policy-handbook.md)

## Success rubric

Employee receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Equity Participant Communicator Policy Handbook](/documents/equity-participant-communicator-policy-handbook.md)
