---
type: Proof Obligation
title: "Golden eval obligation — Run the Spot Buy Negotiation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-spot-buy-negotiation-agent-end-to-end"
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

# Golden eval obligation — Run the Spot Buy Negotiation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [spot-buy-negotiation-agent-end-to-end](/tests/spot-buy-negotiation-agent-end-to-end.md)


## Mechanisms

- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_amazon_business_amazon_business_records](/tools/query-amazon-business-amazon-business-records.md)
- [query_supplier_marketplaces_supplier_marketplaces_records](/tools/query-supplier-marketplaces-supplier-marketplaces-records.md)
- [query_email_api_email_api_records](/tools/query-email-api-email-api-records.md)
- [lookup_spot_buy_negotiation_agent_policy_guide](/tools/lookup-spot-buy-negotiation-agent-policy-guide.md)
- [action_coupa_draft](/tools/action-coupa-draft.md)

## Entities that must be referenced

- requisitions
- amazon_business_records
- supplier_marketplaces_records
- email_api_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute draft without two-system evidence

# Citations

- [spot-buy-negotiation-agent-policy-guide](/documents/spot-buy-negotiation-agent-policy-guide.md)
