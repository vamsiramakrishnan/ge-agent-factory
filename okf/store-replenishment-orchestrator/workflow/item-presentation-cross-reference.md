---
type: Workflow Stage
title: "Item & Presentation Cross-Reference"
description: "Cross-reference item_master, merchandise_hierarchy, and cost_changes in Oracle Retail MFCS to confirm case_pack, item_status, and presentation-minimum constraints before touching any parameter."
source_id: item_presentation_cross_reference
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Item & Presentation Cross-Reference

Cross-reference item_master, merchandise_hierarchy, and cost_changes in Oracle Retail MFCS to confirm case_pack, item_status, and presentation-minimum constraints before touching any parameter.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [action_oracle_retail_mfcs_approve](/tools/action-oracle-retail-mfcs-approve.md)

Next: [Sell-Through & Variance Scoring](/workflow/sell-through-variance-scoring.md)
