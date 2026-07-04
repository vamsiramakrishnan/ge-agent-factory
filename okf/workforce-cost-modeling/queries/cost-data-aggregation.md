---
type: Query Capability
title: "Pull compensation, benefits, overhead, and contractor costs from Workday and ..."
description: "Pull compensation, benefits, overhead, and contractor costs from Workday and SAP BPC. Build fully-loaded cost model with multi-currency normalization."
source_id: "cost-data-aggregation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull compensation, benefits, overhead, and contractor costs from Workday and SAP BPC. Build fully-loaded cost model with multi-currency normalization.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_bpc_budget_lines](/tools/query-sap-bpc-budget-lines.md)
- [lookup_workforce_cost_modeling_policy_handbook](/tools/lookup-workforce-cost-modeling-policy-handbook.md)

## Runs in

- [cost_data_aggregation](/workflow/cost-data-aggregation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Workforce Cost Modeling workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/workforce-cost-modeling-end-to-end.md)

# Citations

- [Workforce Cost Modeling Policy Handbook](/documents/workforce-cost-modeling-policy-handbook.md)
