---
type: Workflow Stage
title: Pattern Retrieval
description: "Search the integration pattern catalog in Confluence, check Apigee for existing endpoints, and review Pub/Sub topology for event-driven options. Pull performance benchmarks from BigQuery."
source_id: pattern_retrieval
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pattern Retrieval

Search the integration pattern catalog in Confluence, check Apigee for existing endpoints, and review Pub/Sub topology for event-driven options. Pull performance benchmarks from BigQuery.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_apigee_apigee_records](/tools/query-apigee-apigee-records.md)
- [query_pub_sub_pub_sub_records](/tools/query-pub-sub-pub-sub-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_integration_pattern_advisor_runbook](/tools/lookup-integration-pattern-advisor-runbook.md)
- [action_confluence_recommend](/tools/action-confluence-recommend.md)

Next: [Trade-off Analysis](/workflow/trade-off-analysis.md)
