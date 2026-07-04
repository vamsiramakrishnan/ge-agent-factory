---
type: Query Capability
title: Extract intercompany balances across all entities. Reconcile offsetting posit...
description: "Extract intercompany balances across all entities. Reconcile offsetting positions and identify timing differences. Group by currency pair and transaction type (management fees, royalties, trade)."
source_id: "ic-balance-aggregation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract intercompany balances across all entities. Reconcile offsetting positions and identify timing differences. Group by currency pair and transaction type (management fees, royalties, trade).

## Tools used

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [lookup_intercompany_netting_agent_controls_playbook](/tools/lookup-intercompany-netting-agent-controls-playbook.md)

## Runs in

- [ic_balance_aggregation](/workflow/ic-balance-aggregation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Intercompany Netting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/intercompany-netting-agent-end-to-end.md)

# Citations

- [Intercompany Netting Agent Controls Playbook](/documents/intercompany-netting-agent-controls-playbook.md)
