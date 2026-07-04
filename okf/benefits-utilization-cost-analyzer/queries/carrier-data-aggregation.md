---
type: Query Capability
title: "Ingest claims, enrollment, and utilization data from all benefits carriers. N..."
description: "Ingest claims, enrollment, and utilization data from all benefits carriers. Normalize across carrier formats and merge with Workday enrollment records."
source_id: "carrier-data-aggregation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest claims, enrollment, and utilization data from all benefits carriers. Normalize across carrier formats and merge with Workday enrollment records.

## Tools used

- [query_benefits_platform_benefit_plans](/tools/query-benefits-platform-benefit-plans.md)
- [query_carrier_reports_carrier_reports_records](/tools/query-carrier-reports-carrier-reports-records.md)
- [lookup_benefits_utilization_cost_analyzer_policy_handbook](/tools/lookup-benefits-utilization-cost-analyzer-policy-handbook.md)

## Runs in

- [carrier_data_aggregation](/workflow/carrier-data-aggregation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Benefits Utilization & Cost Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/benefits-utilization-cost-analyzer-end-to-end.md)

# Citations

- [Benefits Utilization & Cost Analyzer Policy Handbook](/documents/benefits-utilization-cost-analyzer-policy-handbook.md)
