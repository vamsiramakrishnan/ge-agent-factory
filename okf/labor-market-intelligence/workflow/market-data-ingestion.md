---
type: Workflow Stage
title: Market Data Ingestion
description: "Continuous crawling of LinkedIn Talent Insights, Lightcast job postings, and BLS labor statistics. Data normalized and stored in BigQuery market intelligence lake."
source_id: market_data_ingestion
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Market Data Ingestion

Continuous crawling of LinkedIn Talent Insights, Lightcast job postings, and BLS labor statistics. Data normalized and stored in BigQuery market intelligence lake.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_linkedin_talent_insights_linkedin_talent_insights_records](/tools/query-linkedin-talent-insights-linkedin-talent-insights-records.md)
- [query_bls_data_bls_data_records](/tools/query-bls-data-bls-data-records.md)
- [query_lightcast_lightcast_records](/tools/query-lightcast-lightcast-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_labor_market_intelligence_policy_handbook](/tools/lookup-labor-market-intelligence-policy-handbook.md)

Next: [Talent Supply Risk Modeling](/workflow/talent-supply-risk-modeling.md)
