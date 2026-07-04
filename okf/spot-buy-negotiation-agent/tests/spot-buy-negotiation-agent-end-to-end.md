---
type: Eval Scenario
title: Run the Spot Buy Negotiation Agent workflow for the current period. Cite the ...
description: "Run the Spot Buy Negotiation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "spot-buy-negotiation-agent-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Spot Buy Negotiation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [po-execution](/queries/po-execution.md)

## Mechanisms to call

- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_amazon_business_amazon_business_records](/tools/query-amazon-business-amazon-business-records.md)
- [query_supplier_marketplaces_supplier_marketplaces_records](/tools/query-supplier-marketplaces-supplier-marketplaces-records.md)
- [query_email_api_email_api_records](/tools/query-email-api-email-api-records.md)
- [lookup_spot_buy_negotiation_agent_policy_guide](/tools/lookup-spot-buy-negotiation-agent-policy-guide.md)
- [action_coupa_draft](/tools/action-coupa-draft.md)

## Success rubric

Action draft executed against Coupa, with audit-trail entry and Buyer notified of outcomes.

# Citations

- [Spot Buy Negotiation Agent Procurement Policy Guide](/documents/spot-buy-negotiation-agent-policy-guide.md)
