---
type: Proof Obligation
title: "Golden eval obligation — Run the Equity Participant Communicator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-equity-participant-communicator-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Equity Participant Communicator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [equity-participant-communicator-end-to-end](/tests/equity-participant-communicator-end-to-end.md)


## Mechanisms

- [query_e_trade_e_trade_records](/tools/query-e-trade-e-trade-records.md)
- [query_carta_carta_records](/tools/query-carta-carta-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_gmail_messages](/tools/query-gmail-messages.md)
- [lookup_equity_participant_communicator_policy_handbook](/tools/lookup-equity-participant-communicator-policy-handbook.md)

## Entities that must be referenced

- e_trade_records
- carta_records
- employees
- messages

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [equity-participant-communicator-policy-handbook](/documents/equity-participant-communicator-policy-handbook.md)
