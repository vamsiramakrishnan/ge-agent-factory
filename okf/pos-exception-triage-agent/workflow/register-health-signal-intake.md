---
type: Workflow Stage
title: Register Health Signal Intake
description: "Poll Oracle Xstore POS pos_transactions, tender_records, and store_shift_summaries for the failure signatures (void spikes, offline auth flags, dead registers) that precede an associate calling the help desk."
source_id: register_health_signal_intake
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Register Health Signal Intake

Poll Oracle Xstore POS pos_transactions, tender_records, and store_shift_summaries for the failure signatures (void spikes, offline auth flags, dead registers) that precede an associate calling the help desk.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [action_oracle_xstore_pos_escalate](/tools/action-oracle-xstore-pos-escalate.md)

Next: [Ticket Correlation & Dedup](/workflow/ticket-correlation-dedup.md)
