---
type: Workflow Stage
title: "Shift & Cashier Attribution"
description: "Cross-reference store_shift_summaries (shift_lead_name, void_count, cash_over_short) in Oracle Xstore POS to attribute each anomaly cluster to the specific shift and cashier who ran the register."
source_id: shift_cashier_attribution
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Shift & Cashier Attribution

Cross-reference store_shift_summaries (shift_lead_name, void_count, cash_over_short) in Oracle Xstore POS to attribute each anomaly cluster to the specific shift and cashier who ran the register.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_shrink_anomaly_analyzer_execution_playbook](/tools/lookup-shrink-anomaly-analyzer-execution-playbook.md)
- [action_oracle_xstore_pos_file](/tools/action-oracle-xstore-pos-file.md)

Next: [Baseline Variance Comparison](/workflow/baseline-variance-comparison.md)
