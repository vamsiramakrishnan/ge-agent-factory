---
type: Workflow Stage
title: Assortment Gap Triage
description: "Cross-reference flagged queries against product_catalog_entries catalog_status and content_completeness_score in Salesforce Commerce Cloud, and cart_events abandonment signal, to separate true assortment gaps from indexing or content defects."
source_id: assortment_gap_triage
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Assortment Gap Triage

Cross-reference flagged queries against product_catalog_entries catalog_status and content_completeness_score in Salesforce Commerce Cloud, and cart_events abandonment signal, to separate true assortment gaps from indexing or content defects.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [action_salesforce_commerce_cloud_route](/tools/action-salesforce-commerce-cloud-route.md)

Next: [Rule Drafting (Synonym / Redirect / Boost-and-Bury)](/workflow/rule-drafting-synonym-redirect-boost-and-bury.md)
