---
type: Workflow Stage
title: POS Scan Reconciliation
description: "Correlate pos_transactions, tender_records, and store_shift_summaries from Oracle Xstore POS against the Revionics price of record by store_number and transaction_number to surface scan mismatches."
source_id: pos_scan_reconciliation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# POS Scan Reconciliation

Correlate pos_transactions, tender_records, and store_shift_summaries from Oracle Xstore POS against the Revionics price of record by store_number and transaction_number to surface scan mismatches.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_price_execution_audit_monitor_execution_playbook](/tools/lookup-price-execution-audit-monitor-execution-playbook.md)
- [action_oracle_xstore_pos_escalate](/tools/action-oracle-xstore-pos-escalate.md)

Next: [Variance Scoring & Trend Baseline](/workflow/variance-scoring-trend-baseline.md)
