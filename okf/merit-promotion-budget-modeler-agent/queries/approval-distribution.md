---
type: Query Capability
title: Optimized allocation plan presented to Comp Manager for review and approval. ...
description: Optimized allocation plan presented to Comp Manager for review and approval. Approved budgets distributed to managers with guidelines.
source_id: "approval-distribution"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Optimized allocation plan presented to Comp Manager for review and approval. Approved budgets distributed to managers with guidelines.

## Tools used

- [query_sap_bpc_budget_lines](/tools/query-sap-bpc-budget-lines.md)
- [lookup_merit_promotion_budget_modeler_agent_policy_handbook](/tools/lookup-merit-promotion-budget-modeler-agent-policy-handbook.md)

## Runs in

- [approval_distribution](/workflow/approval-distribution.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Merit & Promotion Budget Modeler Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/merit-promotion-budget-modeler-agent-end-to-end.md)

# Citations

- [Merit & Promotion Budget Modeler Agent Policy Handbook](/documents/merit-promotion-budget-modeler-agent-policy-handbook.md)
