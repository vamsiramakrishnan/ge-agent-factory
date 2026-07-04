---
type: Workflow Stage
title: "Zero-Sales Anomaly Sweep"
description: "Scan Oracle Xstore POS pos_transactions and store_shift_summaries store-by-store for positions with zero recorded sales activity despite a positive on-hand balance, the signature read of a phantom-inventory position."
source_id: zero_sales_anomaly_sweep
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Zero-Sales Anomaly Sweep

Scan Oracle Xstore POS pos_transactions and store_shift_summaries store-by-store for positions with zero recorded sales activity despite a positive on-hand balance, the signature read of a phantom-inventory position.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [action_oracle_xstore_pos_publish](/tools/action-oracle-xstore-pos-publish.md)

Next: [Sell-Rate Baseline Reconciliation](/workflow/sell-rate-baseline-reconciliation.md)
