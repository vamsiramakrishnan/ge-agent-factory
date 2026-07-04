---
type: Workflow Stage
title: "Elasticity & Zone Intake"
description: "Pull price_recommendations, price_zones, and elasticity_models from Revionics Price Optimization for the SKU-zone under review and join to item_master in Oracle Retail MFCS to confirm current_retail, unit_cost, and item_status before any ladder is touched."
source_id: elasticity_zone_intake
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Elasticity & Zone Intake

Pull price_recommendations, price_zones, and elasticity_models from Revionics Price Optimization for the SKU-zone under review and join to item_master in Oracle Retail MFCS to confirm current_retail, unit_cost, and item_status before any ladder is touched.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_markdown_optimization_engine_execution_playbook](/tools/lookup-markdown-optimization-engine-execution-playbook.md)
- [action_oracle_retail_mfcs_escalate](/tools/action-oracle-retail-mfcs-escalate.md)

Next: [Aging Inventory Detection](/workflow/aging-inventory-detection.md)
