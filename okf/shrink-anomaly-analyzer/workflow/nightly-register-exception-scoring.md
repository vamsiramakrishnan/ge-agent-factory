---
type: Workflow Stage
title: Nightly Register Exception Scoring
description: "Score every pos_transactions and tender_records row from Oracle Xstore POS overnight for void, refund, no-sale, and discount anomalies at the cashier and register level."
source_id: nightly_register_exception_scoring
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Nightly Register Exception Scoring

Score every pos_transactions and tender_records row from Oracle Xstore POS overnight for void, refund, no-sale, and discount anomalies at the cashier and register level.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [action_oracle_xstore_pos_file](/tools/action-oracle-xstore-pos-file.md)

Next: [Shift & Cashier Attribution](/workflow/shift-cashier-attribution.md)
