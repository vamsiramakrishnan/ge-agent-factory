---
type: Query Capability
title: "Continuous crawling of LinkedIn Talent Insights, Lightcast job postings, and ..."
description: "Continuous crawling of LinkedIn Talent Insights, Lightcast job postings, and BLS labor statistics. Data normalized and stored in BigQuery market intelligence lake."
source_id: "market-data-ingestion"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Continuous crawling of LinkedIn Talent Insights, Lightcast job postings, and BLS labor statistics. Data normalized and stored in BigQuery market intelligence lake.

## Tools used

- [query_linkedin_talent_insights_linkedin_talent_insights_records](/tools/query-linkedin-talent-insights-linkedin-talent-insights-records.md)
- [query_bls_data_bls_data_records](/tools/query-bls-data-bls-data-records.md)
- [query_lightcast_lightcast_records](/tools/query-lightcast-lightcast-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_labor_market_intelligence_policy_handbook](/tools/lookup-labor-market-intelligence-policy-handbook.md)

## Runs in

- [market_data_ingestion](/workflow/market-data-ingestion.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Labor Market Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/labor-market-intelligence-end-to-end.md)

# Citations

- [Labor Market Intelligence Policy Handbook](/documents/labor-market-intelligence-policy-handbook.md)
