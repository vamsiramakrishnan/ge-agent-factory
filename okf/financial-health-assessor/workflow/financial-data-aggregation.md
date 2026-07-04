---
type: Workflow Stage
title: Financial Data Aggregation
description: "Pull financial data feeds from RapidRatings, D&B, and Moody's. Ingest SEC filings for public companies. Store time-series in BigQuery with quarterly snapshots for trend analysis."
source_id: financial_data_aggregation
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Financial Data Aggregation

Pull financial data feeds from RapidRatings, D&B, and Moody's. Ingest SEC filings for public companies. Store time-series in BigQuery with quarterly snapshots for trend analysis.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_rapidratings_rapidratings_records](/tools/query-rapidratings-rapidratings-records.md)
- [query_moody_s_moody_s_records](/tools/query-moody-s-moody-s-records.md)
- [query_sec_edgar_sec_edgar_records](/tools/query-sec-edgar-sec-edgar-records.md)
- [lookup_financial_health_assessor_policy_guide](/tools/lookup-financial-health-assessor-policy-guide.md)

Next: [Predictive Distress Scoring](/workflow/predictive-distress-scoring.md)
