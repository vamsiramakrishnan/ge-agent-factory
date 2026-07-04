---
type: Eval Scenario
title: "Store 482 has been flagged for three consecutive scan-accuracy exceptions on ..."
description: "Store 482 has been flagged for three consecutive scan-accuracy exceptions on SKU 40521193 (POS ringing $2.99 against a Revionics price of record of $2.49). The store_shift_summaries feed for store 482 hasn't refreshed in 3 business days. Determine whether this is a systemic price-zone feed failure or an isolated register error, and recommend the next action."
source_id: "price-execution-audit-monitor-stale-feed-reconciliation"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Store 482 has been flagged for three consecutive scan-accuracy exceptions on SKU 40521193 (POS ringing $2.99 against a Revionics price of record of $2.49). The store_shift_summaries feed for store 482 hasn't refreshed in 3 business days. Determine whether this is a systemic price-zone feed failure or an isolated register error, and recommend the next action.

## Validates

- [pos-scan-reconciliation](/queries/pos-scan-reconciliation.md)

## Mechanisms to call

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_oracle_xstore_pos_store_shift_summaries](/tools/query-oracle-xstore-pos-store-shift-summaries.md)
- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [lookup_price_execution_audit_monitor_execution_playbook](/tools/lookup-price-execution-audit-monitor-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Price Execution Audit Monitor Retail Execution Playbook](/documents/price-execution-audit-monitor-execution-playbook.md)
- [Scanner Price Accuracy & Weights-and-Measures Compliance Bulletin](/documents/price-execution-audit-monitor-scan-accuracy-compliance-bulletin.md)
