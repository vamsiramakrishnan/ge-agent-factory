---
type: Eval Scenario
title: "For store_number 1187, SKU 84021193 on order_number 512847390 is short_picked..."
description: "For store_number 1187, SKU 84021193 on order_number 512847390 is short_picked (pick_tasks task_number 3390221, pick_zone perishable_cooler). inventory_snapshots for store 1187 shows on_hand_units of -2 with negative_on_hand_flag true and safety_stock_units of 12. product_catalog_entries lists SKU 84021193's catalog_status as discontinued_online. The customer is waiting curbside -- what do you recommend?"
source_id: "click-and-collect-sla-monitor-discontinued-substitution"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# For store_number 1187, SKU 84021193 on order_number 512847390 is short_picked (pick_tasks task_number 3390221, pick_zone perishable_cooler). inventory_snapshots for store 1187 shows on_hand_units of -2 with negative_on_hand_flag true and safety_stock_units of 12. product_catalog_entries lists SKU 84021193's catalog_status as discontinued_online. The customer is waiting curbside -- what do you recommend?

## Validates

- [breach-risk-scoring-against-historical-baselines](/queries/breach-risk-scoring-against-historical-baselines.md)

## Mechanisms to call

- [query_manhattan_active_wm_pick_tasks](/tools/query-manhattan-active-wm-pick-tasks.md)
- [query_manhattan_active_wm_inventory_snapshots](/tools/query-manhattan-active-wm-inventory-snapshots.md)
- [query_salesforce_commerce_cloud_product_catalog_entries](/tools/query-salesforce-commerce-cloud-product-catalog-entries.md)
- [lookup_click_and_collect_sla_monitor_execution_playbook](/tools/lookup-click-and-collect-sla-monitor-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Click-and-Collect SLA Monitor Retail Execution Playbook](/documents/click-and-collect-sla-monitor-execution-playbook.md)
- [Curbside & BOPIS Fulfillment SLA Service Schedule](/documents/curbside-bopis-sla-service-schedule.md)
