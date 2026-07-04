---
type: Eval Scenario
title: Run the Labor Market Intelligence workflow for the current period. Cite the r...
description: "Run the Labor Market Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "labor-market-intelligence-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Labor Market Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [market-data-ingestion](/queries/market-data-ingestion.md)

## Mechanisms to call

- [query_linkedin_talent_insights_linkedin_talent_insights_records](/tools/query-linkedin-talent-insights-linkedin-talent-insights-records.md)
- [query_bls_data_bls_data_records](/tools/query-bls-data-bls-data-records.md)
- [query_lightcast_lightcast_records](/tools/query-lightcast-lightcast-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_labor_market_intelligence_policy_handbook](/tools/lookup-labor-market-intelligence-policy-handbook.md)

## Success rubric

CHRO receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Labor Market Intelligence Policy Handbook](/documents/labor-market-intelligence-policy-handbook.md)
