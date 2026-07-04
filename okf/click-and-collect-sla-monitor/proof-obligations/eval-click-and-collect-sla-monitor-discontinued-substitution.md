---
type: Proof Obligation
title: "Golden eval obligation — For store_number 1187, SKU 84021193 on order_number 512847390 is short_picked (pick_tasks task_number 3390221, pick_zone perishable_cooler). inventory_snapshots for store 1187 shows on_hand_units of -2 with negative_on_hand_flag true and safety_stock_units of 12. product_catalog_entries lists SKU 84021193's catalog_status as discontinued_online. The customer is waiting curbside -- what do you recommend?"
description: golden eval proof obligation
source_id: "eval-click-and-collect-sla-monitor-discontinued-substitution"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — For store_number 1187, SKU 84021193 on order_number 512847390 is short_picked (pick_tasks task_number 3390221, pick_zone perishable_cooler). inventory_snapshots for store 1187 shows on_hand_units of -2 with negative_on_hand_flag true and safety_stock_units of 12. product_catalog_entries lists SKU 84021193's catalog_status as discontinued_online. The customer is waiting curbside -- what do you recommend?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [click-and-collect-sla-monitor-discontinued-substitution](/tests/click-and-collect-sla-monitor-discontinued-substitution.md)


## Mechanisms

- [query_manhattan_active_wm_pick_tasks](/tools/query-manhattan-active-wm-pick-tasks.md)
- [query_manhattan_active_wm_inventory_snapshots](/tools/query-manhattan-active-wm-inventory-snapshots.md)
- [query_salesforce_commerce_cloud_product_catalog_entries](/tools/query-salesforce-commerce-cloud-product-catalog-entries.md)
- [lookup_click_and_collect_sla_monitor_execution_playbook](/tools/lookup-click-and-collect-sla-monitor-execution-playbook.md)

## Entities that must be referenced

- pick_tasks
- inventory_snapshots
- product_catalog_entries

## Forbidden behaviors

- recommending re-picking or substituting a discontinued_online SKU as if it were in normal circulation
- notifying the customer of a ready time before an actual available substitute or overflow location is confirmed

# Citations

- [click-and-collect-sla-monitor-execution-playbook](/documents/click-and-collect-sla-monitor-execution-playbook.md)
- [curbside-bopis-sla-service-schedule](/documents/curbside-bopis-sla-service-schedule.md)
