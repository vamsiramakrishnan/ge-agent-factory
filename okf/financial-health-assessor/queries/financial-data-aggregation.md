---
type: Query Capability
title: "Pull financial data feeds from RapidRatings, D&B, and Moody's. Ingest SEC fil..."
description: "Pull financial data feeds from RapidRatings, D&B, and Moody's. Ingest SEC filings for public companies. Store time-series in BigQuery with quarterly snapshots for trend analysis."
source_id: "financial-data-aggregation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull financial data feeds from RapidRatings, D&B, and Moody's. Ingest SEC filings for public companies. Store time-series in BigQuery with quarterly snapshots for trend analysis.

## Tools used

- [query_rapidratings_rapidratings_records](/tools/query-rapidratings-rapidratings-records.md)
- [query_moody_s_moody_s_records](/tools/query-moody-s-moody-s-records.md)
- [query_sec_edgar_sec_edgar_records](/tools/query-sec-edgar-sec-edgar-records.md)
- [lookup_financial_health_assessor_policy_guide](/tools/lookup-financial-health-assessor-policy-guide.md)

## Runs in

- [financial_data_aggregation](/workflow/financial-data-aggregation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Financial Health Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/financial-health-assessor-end-to-end.md)

# Citations

- [Financial Health Assessor Procurement Policy Guide](/documents/financial-health-assessor-policy-guide.md)
