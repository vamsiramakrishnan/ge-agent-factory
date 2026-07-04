---
type: Workflow Stage
title: Retrieve Records
description: Query pos transactions and tender records from Oracle Xstore POS for the Shrink Anomaly Analyzer workflow.
source_id: retrieve_records
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query pos transactions and tender records from Oracle Xstore POS for the Shrink Anomaly Analyzer workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_shrink_anomaly_analyzer_execution_playbook](/tools/lookup-shrink-anomaly-analyzer-execution-playbook.md)
- [action_oracle_xstore_pos_file](/tools/action-oracle-xstore-pos-file.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
