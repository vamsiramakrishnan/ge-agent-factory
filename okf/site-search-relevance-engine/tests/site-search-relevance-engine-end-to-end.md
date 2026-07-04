---
type: Eval Scenario
title: Run the Site Search Relevance Engine workflow for the current period. Cite th...
description: "Run the Site Search Relevance Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "site-search-relevance-engine-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Site Search Relevance Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_site_search_relevance_engine_execution_playbook](/tools/lookup-site-search-relevance-engine-execution-playbook.md)
- [action_salesforce_commerce_cloud_route](/tools/action-salesforce-commerce-cloud-route.md)

## Success rubric

Action route executed against Salesforce Commerce Cloud, with audit-trail entry and Digital Merchandising Manager notified of outcomes.

# Citations

- [Site Search Relevance Engine Retail Execution Playbook](/documents/site-search-relevance-engine-execution-playbook.md)
