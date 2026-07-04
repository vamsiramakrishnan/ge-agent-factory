---
type: Query Capability
title: Check inventory_snapshots on_hand_units and negative_on_hand_flag in Manhatta...
description: "Check inventory_snapshots on_hand_units and negative_on_hand_flag in Manhattan Active WM (query_manhattan_active_wm_inventory_snapshots) against product_catalog_entries catalog_status in Salesforce Commerce Cloud (query_salesforce_commerce_cloud_product_catalog_entries) to find a live substitute for any short-picked SKU."
source_id: "inventory-substitution-validation"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Check inventory_snapshots on_hand_units and negative_on_hand_flag in Manhattan Active WM (query_manhattan_active_wm_inventory_snapshots) against product_catalog_entries catalog_status in Salesforce Commerce Cloud (query_salesforce_commerce_cloud_product_catalog_entries) to find a live substitute for any short-picked SKU.

## Tools used

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [action_salesforce_commerce_cloud_escalate](/tools/action-salesforce-commerce-cloud-escalate.md)

## Runs in

- [inventory_substitution_validation](/workflow/inventory-substitution-validation.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Click-and-Collect SLA Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/click-and-collect-sla-monitor-end-to-end.md)
- [Order number 483920175 (BOPIS, placed 9:14 AM) has been sitting in 'picking' status for 3 hours 10 minutes against the 2-hour SLA. The only pick_tasks record we have for it is task_number 4821093 in wave_id 5502, and that snapshot is 29 hours old. Should we escalate this to store leadership or reroute it to a nearby store, and what's the evidence?](/tests/click-and-collect-sla-monitor-stale-pick-evidence.md)

# Citations

- [Click-and-Collect SLA Monitor Retail Execution Playbook](/documents/click-and-collect-sla-monitor-execution-playbook.md)
- [Curbside & BOPIS Fulfillment SLA Service Schedule](/documents/curbside-bopis-sla-service-schedule.md)
