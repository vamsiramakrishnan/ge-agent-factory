---
type: Eval Scenario
title: "Run the Benefits Utilization & Cost Analyzer workflow for the current period...."
description: "Run the Benefits Utilization & Cost Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "benefits-utilization-cost-analyzer-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Benefits Utilization & Cost Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [carrier-data-aggregation](/queries/carrier-data-aggregation.md)

## Mechanisms to call

- [query_benefits_platform_benefit_plans](/tools/query-benefits-platform-benefit-plans.md)
- [query_carrier_reports_carrier_reports_records](/tools/query-carrier-reports-carrier-reports-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_benefits_utilization_cost_analyzer_policy_handbook](/tools/lookup-benefits-utilization-cost-analyzer-policy-handbook.md)

## Success rubric

Benefits Manager receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Benefits Utilization & Cost Analyzer Policy Handbook](/documents/benefits-utilization-cost-analyzer-policy-handbook.md)
