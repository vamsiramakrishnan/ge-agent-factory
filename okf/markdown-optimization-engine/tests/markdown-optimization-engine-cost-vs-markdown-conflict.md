---
type: Eval Scenario
title: SKU 48213076 in price_zone 17 shows a recommended_retail of $6.49 in price_re...
description: "SKU 48213076 in price_zone 17 shows a recommended_retail of $6.49 in price_recommendations dated 2026-06-28, but Oracle Retail MFCS logged a cost_changes record effective 2026-07-01 raising new_unit_cost from $4.10 to $6.85 for the same SKU due to a tariff_adjustment. Reconcile whether the markdown can still go out, and if not, tell me what to do."
source_id: "markdown-optimization-engine-cost-vs-markdown-conflict"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# SKU 48213076 in price_zone 17 shows a recommended_retail of $6.49 in price_recommendations dated 2026-06-28, but Oracle Retail MFCS logged a cost_changes record effective 2026-07-01 raising new_unit_cost from $4.10 to $6.85 for the same SKU due to a tariff_adjustment. Reconcile whether the markdown can still go out, and if not, tell me what to do.

## Validates

- [elasticity-zone-intake](/queries/elasticity-zone-intake.md)

## Mechanisms to call

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_markdown_optimization_engine_execution_playbook](/tools/lookup-markdown-optimization-engine-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Markdown Optimization Engine Retail Execution Playbook](/documents/markdown-optimization-engine-execution-playbook.md)
- [Vendor Minimum Advertised Price (MAP) & Unit Pricing Compliance Bulletin](/documents/markdown-optimization-engine-map-compliance-bulletin.md)
