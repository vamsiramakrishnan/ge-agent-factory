---
type: Query Capability
title: "Calculate HHI (Herfindahl-Hirschman Index) by category. Run what-if simulatio..."
description: "Calculate HHI (Herfindahl-Hirschman Index) by category. Run what-if simulations modeling the impact of single-supplier failure on revenue and production. Diversification scenario modeling with qualification timeline estimates."
source_id: "concentration-analytics-simulation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Calculate HHI (Herfindahl-Hirschman Index) by category. Run what-if simulations modeling the impact of single-supplier failure on revenue and production. Diversification scenario modeling with qualification timeline estimates.

## Tools used

- [query_supplier_master_supplier_master_records](/tools/query-supplier-master-supplier-master-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_concentration_risk_analyzer_policy_guide](/tools/lookup-concentration-risk-analyzer-policy-guide.md)

## Runs in

- [concentration_analytics_simulation](/workflow/concentration-analytics-simulation.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Concentration Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/concentration-risk-analyzer-end-to-end.md)

# Citations

- [Concentration Risk Analyzer Procurement Policy Guide](/documents/concentration-risk-analyzer-policy-guide.md)
