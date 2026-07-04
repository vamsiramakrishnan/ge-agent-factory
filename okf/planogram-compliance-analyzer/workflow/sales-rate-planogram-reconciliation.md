---
type: Workflow Stage
title: "Sales-Rate & Planogram Reconciliation"
description: "Correlate Oracle Xstore POS pos_transactions sales-rate signals against the planogram of record to surface facing, position, and missing-item deviations store by store."
source_id: sales_rate_planogram_reconciliation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Sales-Rate & Planogram Reconciliation

Correlate Oracle Xstore POS pos_transactions sales-rate signals against the planogram of record to surface facing, position, and missing-item deviations store by store.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_planogram_compliance_analyzer_execution_playbook](/tools/lookup-planogram-compliance-analyzer-execution-playbook.md)
- [action_oracle_retail_mfcs_escalate](/tools/action-oracle-retail-mfcs-escalate.md)

Next: [Compliance Scoring Against Historical Baseline](/workflow/compliance-scoring-against-historical-baseline.md)
