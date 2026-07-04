---
type: Query Capability
title: "Analyze usage patterns, cost trends, and outliers across plan types. Identify..."
description: "Analyze usage patterns, cost trends, and outliers across plan types. Identify underutilized high-value benefits and cost drivers by population segment."
source_id: "utilization-cost-analysis"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Analyze usage patterns, cost trends, and outliers across plan types. Identify underutilized high-value benefits and cost drivers by population segment.

## Tools used

- [query_benefits_platform_benefit_plans](/tools/query-benefits-platform-benefit-plans.md)
- [lookup_benefits_utilization_cost_analyzer_policy_handbook](/tools/lookup-benefits-utilization-cost-analyzer-policy-handbook.md)

## Runs in

- [utilization_cost_analysis](/workflow/utilization-cost-analysis.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Benefits Utilization & Cost Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/benefits-utilization-cost-analyzer-end-to-end.md)

# Citations

- [Benefits Utilization & Cost Analyzer Policy Handbook](/documents/benefits-utilization-cost-analyzer-policy-handbook.md)
