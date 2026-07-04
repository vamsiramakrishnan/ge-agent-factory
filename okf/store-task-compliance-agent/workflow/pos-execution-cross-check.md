---
type: Workflow Stage
title: "POS Execution Cross-Check"
description: "Correlate reported task and promo-setup completion against Oracle Xstore POS pos_transactions, tender_records, and store_shift_summaries (query_oracle_xstore_pos_pos_transactions) to catch self-reported completions with no matching register activity."
source_id: pos_execution_cross_check
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# POS Execution Cross-Check

Correlate reported task and promo-setup completion against Oracle Xstore POS pos_transactions, tender_records, and store_shift_summaries (query_oracle_xstore_pos_pos_transactions) to catch self-reported completions with no matching register activity.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_store_task_compliance_agent_execution_playbook](/tools/lookup-store-task-compliance-agent-execution-playbook.md)

Next: [Baseline Variance Scoring](/workflow/baseline-variance-scoring.md)
