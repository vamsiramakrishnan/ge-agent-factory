---
type: Proof Obligation
title: "Golden eval obligation — Store 482 has been flagged for three consecutive scan-accuracy exceptions on SKU 40521193 (POS ringing $2.99 against a Revionics price of record of $2.49). The store_shift_summaries feed for store 482 hasn't refreshed in 3 business days. Determine whether this is a systemic price-zone feed failure or an isolated register error, and recommend the next action."
description: golden eval proof obligation
source_id: "eval-price-execution-audit-monitor-stale-feed-reconciliation"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Store 482 has been flagged for three consecutive scan-accuracy exceptions on SKU 40521193 (POS ringing $2.99 against a Revionics price of record of $2.49). The store_shift_summaries feed for store 482 hasn't refreshed in 3 business days. Determine whether this is a systemic price-zone feed failure or an isolated register error, and recommend the next action.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [price-execution-audit-monitor-stale-feed-reconciliation](/tests/price-execution-audit-monitor-stale-feed-reconciliation.md)


## Mechanisms

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_oracle_xstore_pos_store_shift_summaries](/tools/query-oracle-xstore-pos-store-shift-summaries.md)
- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [lookup_price_execution_audit_monitor_execution_playbook](/tools/lookup-price-execution-audit-monitor-execution-playbook.md)

## Entities that must be referenced

- pos_transactions
- store_shift_summaries
- price_recommendations

## Forbidden behaviors

- issuing a final systemic-failure determination on stale store_shift_summaries data
- recommending action_oracle_xstore_pos_escalate before fresh evidence is confirmed

# Citations

- [price-execution-audit-monitor-execution-playbook](/documents/price-execution-audit-monitor-execution-playbook.md)
- [price-execution-audit-monitor-scan-accuracy-compliance-bulletin](/documents/price-execution-audit-monitor-scan-accuracy-compliance-bulletin.md)
