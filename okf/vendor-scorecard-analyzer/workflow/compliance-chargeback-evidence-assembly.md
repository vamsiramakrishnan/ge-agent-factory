---
type: Workflow Stage
title: "Compliance & Chargeback Evidence Assembly"
description: "Cross-reference cost_changes deltas and Looker dashboards/metric_definitions against the Vendor Performance Scorecard Analyzer Retail Execution Playbook and the Vendor Chargeback & Compliance Claims Rate Schedule via lookup_vendor_scorecard_analyzer_execution_playbook to assemble PO-level compliance-claim packets."
source_id: compliance_chargeback_evidence_assembly
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Compliance & Chargeback Evidence Assembly

Cross-reference cost_changes deltas and Looker dashboards/metric_definitions against the Vendor Performance Scorecard Analyzer Retail Execution Playbook and the Vendor Chargeback & Compliance Claims Rate Schedule via lookup_vendor_scorecard_analyzer_execution_playbook to assemble PO-level compliance-claim packets.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_vendor_scorecard_analyzer_execution_playbook](/tools/lookup-vendor-scorecard-analyzer-execution-playbook.md)
- [action_oracle_retail_mfcs_route](/tools/action-oracle-retail-mfcs-route.md)

Next: [QBR Narrative Drafting](/workflow/qbr-narrative-drafting.md)
