---
type: Workflow Stage
title: Retrieve Records
description: Query item master and merchandise hierarchy from Oracle Retail MFCS and correlate with Oracle Xstore POS for the Planogram Compliance Analyzer workflow.
source_id: retrieve_records
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query item master and merchandise hierarchy from Oracle Retail MFCS and correlate with Oracle Xstore POS for the Planogram Compliance Analyzer workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_planogram_compliance_analyzer_execution_playbook](/tools/lookup-planogram-compliance-analyzer-execution-playbook.md)
- [action_oracle_retail_mfcs_escalate](/tools/action-oracle-retail-mfcs-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
