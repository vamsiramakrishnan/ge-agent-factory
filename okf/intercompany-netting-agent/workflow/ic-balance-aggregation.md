---
type: Workflow Stage
title: IC Balance Aggregation
description: "Extract intercompany balances across all entities. Reconcile offsetting positions and identify timing differences. Group by currency pair and transaction type (management fees, royalties, trade)."
source_id: ic_balance_aggregation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# IC Balance Aggregation

Extract intercompany balances across all entities. Reconcile offsetting positions and identify timing differences. Group by currency pair and transaction type (management fees, royalties, trade).

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [lookup_intercompany_netting_agent_controls_playbook](/tools/lookup-intercompany-netting-agent-controls-playbook.md)

Next: [Multi-Currency Netting](/workflow/multi-currency-netting.md)
