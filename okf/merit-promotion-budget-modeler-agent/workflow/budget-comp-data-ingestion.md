---
type: Workflow Stage
title: "Budget & Comp Data Ingestion"
description: "Pull current compensation data, performance ratings, and headcount from Workday. Load merit pool parameters and promotion budget guidelines from finance."
source_id: budget_comp_data_ingestion
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Budget & Comp Data Ingestion

Pull current compensation data, performance ratings, and headcount from Workday. Load merit pool parameters and promotion budget guidelines from finance.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_bpc_budget_lines](/tools/query-sap-bpc-budget-lines.md)
- [lookup_merit_promotion_budget_modeler_agent_policy_handbook](/tools/lookup-merit-promotion-budget-modeler-agent-policy-handbook.md)

Next: [Multi-Scenario Modeling](/workflow/multi-scenario-modeling.md)
