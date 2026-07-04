---
type: Eval Scenario
title: Run the Force Majeure Advisor workflow for the current period. Cite the relev...
description: "Run the Force Majeure Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "force-majeure-advisor-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Force Majeure Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [event-contract-matching](/queries/event-contract-matching.md)

## Mechanisms to call

- [query_contract_repository_contract_repository_records](/tools/query-contract-repository-contract-repository-records.md)
- [query_legal_knowledge_base_legal_knowledge_base_records](/tools/query-legal-knowledge-base-legal-knowledge-base-records.md)
- [query_procurement_3_procurement_3_records](/tools/query-procurement-3-procurement-3-records.md)
- [lookup_force_majeure_advisor_policy_guide](/tools/lookup-force-majeure-advisor-policy-guide.md)
- [action_contract_repository_recommend](/tools/action-contract-repository-recommend.md)

## Success rubric

Action recommend executed against Contract Repository, with audit-trail entry and Legal Procurement Counsel notified of outcomes.

# Citations

- [Force Majeure Advisor Procurement Policy Guide](/documents/force-majeure-advisor-policy-guide.md)
