---
type: Query Capability
title: "Search the integration pattern catalog in Confluence, check Apigee for existi..."
description: "Search the integration pattern catalog in Confluence, check Apigee for existing endpoints, and review Pub/Sub topology for event-driven options. Pull performance benchmarks from BigQuery."
source_id: "pattern-retrieval"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Search the integration pattern catalog in Confluence, check Apigee for existing endpoints, and review Pub/Sub topology for event-driven options. Pull performance benchmarks from BigQuery.

## Tools used

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_apigee_apigee_records](/tools/query-apigee-apigee-records.md)
- [query_pub_sub_pub_sub_records](/tools/query-pub-sub-pub-sub-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_integration_pattern_advisor_runbook](/tools/lookup-integration-pattern-advisor-runbook.md)
- [action_confluence_recommend](/tools/action-confluence-recommend.md)

## Runs in

- [pattern_retrieval](/workflow/pattern-retrieval.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Integration Pattern Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/integration-pattern-advisor-end-to-end.md)

# Citations

- [Integration Pattern Advisor Operations Runbook](/documents/integration-pattern-advisor-runbook.md)
