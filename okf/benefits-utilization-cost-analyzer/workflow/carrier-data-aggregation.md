---
type: Workflow Stage
title: Carrier Data Aggregation
description: "Ingest claims, enrollment, and utilization data from all benefits carriers. Normalize across carrier formats and merge with Workday enrollment records."
source_id: carrier_data_aggregation
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Carrier Data Aggregation

Ingest claims, enrollment, and utilization data from all benefits carriers. Normalize across carrier formats and merge with Workday enrollment records.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_benefits_platform_benefit_plans](/tools/query-benefits-platform-benefit-plans.md)
- [query_carrier_reports_carrier_reports_records](/tools/query-carrier-reports-carrier-reports-records.md)
- [lookup_benefits_utilization_cost_analyzer_policy_handbook](/tools/lookup-benefits-utilization-cost-analyzer-policy-handbook.md)

Next: [Utilization & Cost Analysis](/workflow/utilization-cost-analysis.md)
