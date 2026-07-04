---
type: Workflow Stage
title: "Inventory & Substitution Validation"
description: "Check inventory_snapshots on_hand_units and negative_on_hand_flag in Manhattan Active WM (query_manhattan_active_wm_inventory_snapshots) against product_catalog_entries catalog_status in Salesforce Commerce Cloud (query_salesforce_commerce_cloud_product_catalog_entries) to find a live substitute for any short-picked SKU."
source_id: inventory_substitution_validation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Inventory & Substitution Validation

Check inventory_snapshots on_hand_units and negative_on_hand_flag in Manhattan Active WM (query_manhattan_active_wm_inventory_snapshots) against product_catalog_entries catalog_status in Salesforce Commerce Cloud (query_salesforce_commerce_cloud_product_catalog_entries) to find a live substitute for any short-picked SKU.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [action_salesforce_commerce_cloud_escalate](/tools/action-salesforce-commerce-cloud-escalate.md)

Next: [Playbook-Gated Escalation & Customer Notification](/workflow/playbook-gated-escalation-customer-notification.md)
