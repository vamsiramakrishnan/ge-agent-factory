---
type: Query Capability
title: "Aggregate performance ratings, assessment results, leadership indicators, and..."
description: "Aggregate performance ratings, assessment results, leadership indicators, and career trajectory data from Workday into BigQuery talent warehouse."
source_id: "talent-data-aggregation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate performance ratings, assessment results, leadership indicators, and career trajectory data from Workday into BigQuery talent warehouse.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_assessment_platform_assessment_platform_records](/tools/query-assessment-platform-assessment-platform-records.md)
- [lookup_successor_readiness_assessment_policy_handbook](/tools/lookup-successor-readiness-assessment-policy-handbook.md)

## Runs in

- [talent_data_aggregation](/workflow/talent-data-aggregation.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Successor Readiness Assessment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/successor-readiness-assessment-end-to-end.md)

# Citations

- [Successor Readiness Assessment Policy Handbook](/documents/successor-readiness-assessment-policy-handbook.md)
