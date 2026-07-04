---
type: Query Capability
title: "Pull current compensation data, performance ratings, and headcount from Workd..."
description: "Pull current compensation data, performance ratings, and headcount from Workday. Load merit pool parameters and promotion budget guidelines from finance."
source_id: "budget-comp-data-ingestion"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull current compensation data, performance ratings, and headcount from Workday. Load merit pool parameters and promotion budget guidelines from finance.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_bpc_budget_lines](/tools/query-sap-bpc-budget-lines.md)
- [lookup_merit_promotion_budget_modeler_agent_policy_handbook](/tools/lookup-merit-promotion-budget-modeler-agent-policy-handbook.md)

## Runs in

- [budget_comp_data_ingestion](/workflow/budget-comp-data-ingestion.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Merit & Promotion Budget Modeler Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/merit-promotion-budget-modeler-agent-end-to-end.md)

# Citations

- [Merit & Promotion Budget Modeler Agent Policy Handbook](/documents/merit-promotion-budget-modeler-agent-policy-handbook.md)
