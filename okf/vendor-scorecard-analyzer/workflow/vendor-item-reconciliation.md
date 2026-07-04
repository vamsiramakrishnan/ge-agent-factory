---
type: Workflow Stage
title: "Vendor & Item Reconciliation"
description: "Query item_master, merchandise_hierarchy, and cost_changes from Oracle Retail MFCS to reconcile each vendor_number's active SKUs, buyer assignment, and latest cost changes for the scorecard period."
source_id: vendor_item_reconciliation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Vendor & Item Reconciliation

Query item_master, merchandise_hierarchy, and cost_changes from Oracle Retail MFCS to reconcile each vendor_number's active SKUs, buyer assignment, and latest cost changes for the scorecard period.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_vendor_scorecard_analyzer_execution_playbook](/tools/lookup-vendor-scorecard-analyzer-execution-playbook.md)
- [action_oracle_retail_mfcs_route](/tools/action-oracle-retail-mfcs-route.md)

Next: [Fill Rate, Lead-Time & Invoice Scoring](/workflow/fill-rate-lead-time-invoice-scoring.md)
