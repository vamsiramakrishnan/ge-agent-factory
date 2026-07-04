---
type: Workflow Stage
title: Retrieve Records
description: Query price recommendations and price zones from Revionics Price Optimization and correlate with Oracle Xstore POS for the Price Execution Audit Monitor workflow.
source_id: retrieve_records
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query price recommendations and price zones from Revionics Price Optimization and correlate with Oracle Xstore POS for the Price Execution Audit Monitor workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_price_execution_audit_monitor_execution_playbook](/tools/lookup-price-execution-audit-monitor-execution-playbook.md)
- [action_oracle_xstore_pos_escalate](/tools/action-oracle-xstore-pos-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
