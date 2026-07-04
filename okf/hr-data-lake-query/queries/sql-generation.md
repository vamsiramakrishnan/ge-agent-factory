---
type: Query Capability
title: "Gemini translates natural language into optimized BigQuery SQL, joining acros..."
description: "Gemini translates natural language into optimized BigQuery SQL, joining across HR data lake tables. Apply row-level security and data governance rules."
source_id: "sql-generation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini translates natural language into optimized BigQuery SQL, joining across HR data lake tables. Apply row-level security and data governance rules.

## Tools used

- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_hr_data_lake_query_policy_handbook](/tools/lookup-hr-data-lake-query-policy-handbook.md)

## Runs in

- [sql_generation](/workflow/sql-generation.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the HR Data Lake Query workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/hr-data-lake-query-end-to-end.md)

# Citations

- [HR Data Lake Query Policy Handbook](/documents/hr-data-lake-query-policy-handbook.md)
