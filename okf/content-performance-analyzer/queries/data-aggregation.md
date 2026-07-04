---
type: Query Capability
title: "Pull page-level analytics from GA4, content engagement from HubSpot, ranking ..."
description: "Pull page-level analytics from GA4, content engagement from HubSpot, ranking data from SEMrush. Aggregate in BigQuery with content inventory from WordPress."
source_id: "data-aggregation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull page-level analytics from GA4, content engagement from HubSpot, ranking data from SEMrush. Aggregate in BigQuery with content inventory from WordPress.

## Tools used

- [query_google_analytics_4_session_events](/tools/query-google-analytics-4-session-events.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_content_performance_analyzer_playbook](/tools/lookup-content-performance-analyzer-playbook.md)
- [action_hubspot_recommend](/tools/action-hubspot-recommend.md)

## Runs in

- [data_aggregation](/workflow/data-aggregation.md)

## Evidence expected

- sql_result
- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Content Performance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/content-performance-analyzer-end-to-end.md)

# Citations

- [Content Performance Analyzer Playbook](/documents/content-performance-analyzer-playbook.md)
