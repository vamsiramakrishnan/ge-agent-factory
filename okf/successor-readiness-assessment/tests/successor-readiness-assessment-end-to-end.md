---
type: Eval Scenario
title: Run the Successor Readiness Assessment workflow for the current period. Cite ...
description: "Run the Successor Readiness Assessment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "successor-readiness-assessment-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Successor Readiness Assessment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [talent-data-aggregation](/queries/talent-data-aggregation.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_assessment_platform_assessment_platform_records](/tools/query-assessment-platform-assessment-platform-records.md)
- [lookup_successor_readiness_assessment_policy_handbook](/tools/lookup-successor-readiness-assessment-policy-handbook.md)

## Success rubric

CHRO receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Successor Readiness Assessment Policy Handbook](/documents/successor-readiness-assessment-policy-handbook.md)
