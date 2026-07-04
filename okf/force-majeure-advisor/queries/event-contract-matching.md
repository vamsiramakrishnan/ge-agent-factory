---
type: Query Capability
title: "Receive disruption event trigger (port strike, natural disaster, pandemic). P..."
description: "Receive disruption event trigger (port strike, natural disaster, pandemic). Perform RAG over contract repository to identify all contracts affected by the specific event. Retrieve relevant FM and termination clauses."
source_id: "event-contract-matching"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive disruption event trigger (port strike, natural disaster, pandemic). Perform RAG over contract repository to identify all contracts affected by the specific event. Retrieve relevant FM and termination clauses.

## Tools used

- [query_contract_repository_contract_repository_records](/tools/query-contract-repository-contract-repository-records.md)
- [lookup_force_majeure_advisor_policy_guide](/tools/lookup-force-majeure-advisor-policy-guide.md)
- [action_contract_repository_recommend](/tools/action-contract-repository-recommend.md)

## Runs in

- [event_contract_matching](/workflow/event-contract-matching.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Force Majeure Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/force-majeure-advisor-end-to-end.md)

# Citations

- [Force Majeure Advisor Procurement Policy Guide](/documents/force-majeure-advisor-policy-guide.md)
