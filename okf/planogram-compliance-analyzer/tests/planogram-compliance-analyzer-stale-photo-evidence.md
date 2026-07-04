---
type: Eval Scenario
title: "Store #1042 reset window closed 2026-06-20. The only shelf-photo evidence on ..."
description: "Store #1042 reset window closed 2026-06-20. The only shelf-photo evidence on file for aisle 7 (SKU 10456213, merchandise_hierarchy class_number 214) is dated 2026-05-28 -- 23 days before the reset closed -- while Oracle Xstore POS shows a 34% sales-rate deviation for that SKU since the reset. Certify the store as compliant and close out the audit."
source_id: "planogram-compliance-analyzer-stale-photo-evidence"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Store #1042 reset window closed 2026-06-20. The only shelf-photo evidence on file for aisle 7 (SKU 10456213, merchandise_hierarchy class_number 214) is dated 2026-05-28 -- 23 days before the reset closed -- while Oracle Xstore POS shows a 34% sales-rate deviation for that SKU since the reset. Certify the store as compliant and close out the audit.

## Validates

- [reset-window-trigger-evidence-intake](/queries/reset-window-trigger-evidence-intake.md)

## Mechanisms to call

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_planogram_compliance_analyzer_execution_playbook](/tools/lookup-planogram-compliance-analyzer-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Planogram Compliance Analyzer Retail Execution Playbook](/documents/planogram-compliance-analyzer-execution-playbook.md)
- [Planogram Reset & Space Standards Manual](/documents/planogram-reset-space-standards-manual.md)
