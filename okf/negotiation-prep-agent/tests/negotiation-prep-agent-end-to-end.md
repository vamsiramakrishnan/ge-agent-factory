---
type: Eval Scenario
title: Run the Negotiation Prep Agent workflow for the current period. Cite the rele...
description: "Run the Negotiation Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "negotiation-prep-agent-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Negotiation Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [contract-market-assembly](/queries/contract-market-assembly.md)

## Mechanisms to call

- [query_icertis_contracts](/tools/query-icertis-contracts.md)
- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [query_spend_data_spend_data_records](/tools/query-spend-data-spend-data-records.md)
- [query_market_intel_market_intel_records](/tools/query-market-intel-market-intel-records.md)
- [lookup_negotiation_prep_agent_policy_guide](/tools/lookup-negotiation-prep-agent-policy-guide.md)
- [action_icertis_generate](/tools/action-icertis-generate.md)

## Success rubric

Action generate executed against Icertis, with audit-trail entry and Category Manager notified of outcomes.

# Citations

- [Negotiation Prep Agent Procurement Policy Guide](/documents/negotiation-prep-agent-policy-guide.md)
