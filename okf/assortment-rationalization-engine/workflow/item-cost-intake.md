---
type: Workflow Stage
title: "Item & Cost Intake"
description: "Pull item_master, merchandise_hierarchy, and cost_changes from Oracle Retail MFCS to establish the current SKU roster, class/subclass ownership (buyer_name, gmroi_target, markdown_budget_pct), and any pending vendor cost movement before scoring begins."
source_id: item_cost_intake
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Item & Cost Intake

Pull item_master, merchandise_hierarchy, and cost_changes from Oracle Retail MFCS to establish the current SKU roster, class/subclass ownership (buyer_name, gmroi_target, markdown_budget_pct), and any pending vendor cost movement before scoring begins.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [action_oracle_retail_mfcs_route](/tools/action-oracle-retail-mfcs-route.md)

Next: [Productivity & Transferable-Demand Scoring](/workflow/productivity-transferable-demand-scoring.md)
