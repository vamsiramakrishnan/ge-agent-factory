---
type: Query Capability
title: "Cross-reference flagged queries against product_catalog_entries catalog_statu..."
description: "Cross-reference flagged queries against product_catalog_entries catalog_status and content_completeness_score in Salesforce Commerce Cloud, and cart_events abandonment signal, to separate true assortment gaps from indexing or content defects."
source_id: "assortment-gap-triage"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cross-reference flagged queries against product_catalog_entries catalog_status and content_completeness_score in Salesforce Commerce Cloud, and cart_events abandonment signal, to separate true assortment gaps from indexing or content defects.

## Tools used

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [action_salesforce_commerce_cloud_route](/tools/action-salesforce-commerce-cloud-route.md)

## Runs in

- [assortment_gap_triage](/workflow/assortment-gap-triage.md)

## Evidence expected

- source_system_record
- sql_result
- api_response
- generated_audit_trail

## Evals

- [Run the Site Search Relevance Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/site-search-relevance-engine-end-to-end.md)
- [Promote the boost-and-bury rule for query 'puffer jacket' to production now -- the A/B test in conversion_paths id 4021 only ran against 3,800 sessions versus the 15,000-session minimum sample size, but the null search result rate for that term has sat at 9.4% since June 27. Ship it today.](/tests/site-search-relevance-engine-stale-ab-test-promotion.md)
- [session_events record for session 74213099 shows zero results returned for 'quilted jacket' as of this morning, but bigquery historical_metrics last computed_at is from 30 hours ago and cached_aggregates still shows the old 14% null-rate baseline. Reconcile the two and tell me whether we should redirect 'quilted jacket' to the puffer-jacket category page.](/tests/site-search-relevance-engine-conflicting-staleness-reconciliation.md)

# Citations

- [Site Search Relevance Engine Retail Execution Playbook](/documents/site-search-relevance-engine-execution-playbook.md)
- [Site Search Rule Governance & Synonym Standard](/documents/site-search-relevance-engine-rule-governance-standard.md)
