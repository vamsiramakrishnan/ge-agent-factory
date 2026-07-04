---
type: Workflow Stage
title: SQL Generation
description: "Gemini translates natural language into optimized BigQuery SQL, joining across HR data lake tables. Apply row-level security and data governance rules."
source_id: sql_generation
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# SQL Generation

Gemini translates natural language into optimized BigQuery SQL, joining across HR data lake tables. Apply row-level security and data governance rules.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_hr_data_lake_query_policy_handbook](/tools/lookup-hr-data-lake-query-policy-handbook.md)

Next: [Execution & Validation](/workflow/execution-validation.md)
