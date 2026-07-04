---
type: Query Capability
title: Generate budget projections with variance analysis against current plan. Prov...
description: "Generate budget projections with variance analysis against current plan. Provide drill-down by BU, geography, and cost center with narrative explanations."
source_id: "financial-impact-report"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate budget projections with variance analysis against current plan. Provide drill-down by BU, geography, and cost center with narrative explanations.

## Tools used

- [query_sap_bpc_budget_lines](/tools/query-sap-bpc-budget-lines.md)
- [lookup_workforce_cost_modeling_policy_handbook](/tools/lookup-workforce-cost-modeling-policy-handbook.md)

## Runs in

- [financial_impact_report](/workflow/financial-impact-report.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Workforce Cost Modeling workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/workforce-cost-modeling-end-to-end.md)

# Citations

- [Workforce Cost Modeling Policy Handbook](/documents/workforce-cost-modeling-policy-handbook.md)
