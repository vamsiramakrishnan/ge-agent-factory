---
type: Query Capability
title: "Model termination scenarios for each affected contract — wind-down charges, c..."
description: "Model termination scenarios for each affected contract — wind-down charges, cure period requirements, documented non-performance thresholds. Calculate financial exposure across the affected portfolio."
source_id: "termination-cost-modeling"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Model termination scenarios for each affected contract — wind-down charges, cure period requirements, documented non-performance thresholds. Calculate financial exposure across the affected portfolio.

## Tools used

- [query_contract_repository_contract_repository_records](/tools/query-contract-repository-contract-repository-records.md)
- [lookup_force_majeure_advisor_policy_guide](/tools/lookup-force-majeure-advisor-policy-guide.md)
- [action_contract_repository_recommend](/tools/action-contract-repository-recommend.md)

## Runs in

- [termination_cost_modeling](/workflow/termination-cost-modeling.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Force Majeure Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/force-majeure-advisor-end-to-end.md)

# Citations

- [Force Majeure Advisor Procurement Policy Guide](/documents/force-majeure-advisor-policy-guide.md)
