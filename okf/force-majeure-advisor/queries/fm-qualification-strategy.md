---
type: Query Capability
title: "Gemini reasons whether specific event qualifies under each contract's FM prov..."
description: "Gemini reasons whether specific event qualifies under each contract's FM provisions — jurisdiction-aware analysis distinguishing 'labor disputes at supplier facility' from third-party port strikes. Models termination-for-cause vs. termination-for-convenience trade-offs. Generates recommended negotiation strategies: 'Recommend negotiating voluntary exit with reduced termination fee.'"
source_id: "fm-qualification-strategy"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reasons whether specific event qualifies under each contract's FM provisions — jurisdiction-aware analysis distinguishing 'labor disputes at supplier facility' from third-party port strikes. Models termination-for-cause vs. termination-for-convenience trade-offs. Generates recommended negotiation strategies: 'Recommend negotiating voluntary exit with reduced termination fee.'

## Tools used

- [query_contract_repository_contract_repository_records](/tools/query-contract-repository-contract-repository-records.md)
- [lookup_force_majeure_advisor_policy_guide](/tools/lookup-force-majeure-advisor-policy-guide.md)
- [action_contract_repository_recommend](/tools/action-contract-repository-recommend.md)

## Runs in

- [fm_qualification_strategy](/workflow/fm-qualification-strategy.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Force Majeure Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/force-majeure-advisor-end-to-end.md)

# Citations

- [Force Majeure Advisor Procurement Policy Guide](/documents/force-majeure-advisor-policy-guide.md)
