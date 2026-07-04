---
type: Workflow Stage
title: "Event & Contract Matching"
description: "Receive disruption event trigger (port strike, natural disaster, pandemic). Perform RAG over contract repository to identify all contracts affected by the specific event. Retrieve relevant FM and termination clauses."
source_id: event_contract_matching
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Event & Contract Matching

Receive disruption event trigger (port strike, natural disaster, pandemic). Perform RAG over contract repository to identify all contracts affected by the specific event. Retrieve relevant FM and termination clauses.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_contract_repository_contract_repository_records](/tools/query-contract-repository-contract-repository-records.md)
- [lookup_force_majeure_advisor_policy_guide](/tools/lookup-force-majeure-advisor-policy-guide.md)
- [action_contract_repository_recommend](/tools/action-contract-repository-recommend.md)

Next: [Termination Cost Modeling](/workflow/termination-cost-modeling.md)
