---
type: Workflow Stage
title: "Claim Intake & Order Match"
description: "Match the incoming return claim to its online_orders and product_catalog_entries records in Salesforce Commerce Cloud, and pull the originating cart_events session to establish add-to-cart-to-return timing."
source_id: claim_intake_order_match
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Claim Intake & Order Match

Match the incoming return claim to its online_orders and product_catalog_entries records in Salesforce Commerce Cloud, and pull the originating cart_events session to establish add-to-cart-to-return timing.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [action_salesforce_commerce_cloud_file](/tools/action-salesforce-commerce-cloud-file.md)

Next: [Cross-Channel Behavior Graph](/workflow/cross-channel-behavior-graph.md)
