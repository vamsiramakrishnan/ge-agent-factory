---
type: Proof Obligation
title: "Golden eval obligation — Run the Negotiation Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-negotiation-prep-agent-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Negotiation Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [negotiation-prep-agent-end-to-end](/tests/negotiation-prep-agent-end-to-end.md)


## Mechanisms

- [query_icertis_contracts](/tools/query-icertis-contracts.md)
- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [query_spend_data_spend_data_records](/tools/query-spend-data-spend-data-records.md)
- [query_market_intel_market_intel_records](/tools/query-market-intel-market-intel-records.md)
- [lookup_negotiation_prep_agent_policy_guide](/tools/lookup-negotiation-prep-agent-policy-guide.md)
- [action_icertis_generate](/tools/action-icertis-generate.md)

## Entities that must be referenced

- contracts
- contracts
- spend_data_records
- market_intel_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [negotiation-prep-agent-policy-guide](/documents/negotiation-prep-agent-policy-guide.md)
