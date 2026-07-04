---
type: Workflow Stage
title: "Reset-Window Trigger & Evidence Intake"
description: "After every reset window closes, pull item_master and merchandise_hierarchy records from Oracle Retail MFCS and ingest the store's shelf-photo evidence set for the Planogram Compliance Analyzer workflow."
source_id: reset_window_trigger_evidence_intake
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Reset-Window Trigger & Evidence Intake

After every reset window closes, pull item_master and merchandise_hierarchy records from Oracle Retail MFCS and ingest the store's shelf-photo evidence set for the Planogram Compliance Analyzer workflow.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_planogram_compliance_analyzer_execution_playbook](/tools/lookup-planogram-compliance-analyzer-execution-playbook.md)
- [action_oracle_retail_mfcs_escalate](/tools/action-oracle-retail-mfcs-escalate.md)

Next: [Sales-Rate & Planogram Reconciliation](/workflow/sales-rate-planogram-reconciliation.md)
