---
type: Workflow Stage
title: Retrieve Records
description: Query online orders and product catalog entries from Salesforce Commerce Cloud and correlate with GA4 for the Site Search Relevance Engine workflow.
source_id: retrieve_records
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query online orders and product catalog entries from Salesforce Commerce Cloud and correlate with GA4 for the Site Search Relevance Engine workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [lookup_site_search_relevance_engine_execution_playbook](/tools/lookup-site-search-relevance-engine-execution-playbook.md)
- [action_salesforce_commerce_cloud_route](/tools/action-salesforce-commerce-cloud-route.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
