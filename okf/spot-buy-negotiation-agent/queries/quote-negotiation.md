---
type: Query Capability
title: Gemini drafts contextual quote requests with sufficient specification detail ...
description: "Gemini drafts contextual quote requests with sufficient specification detail for accurate supplier pricing. Evaluates quote responses including caveats and conditions, then generates negotiation emails when quotes exceed benchmark range."
source_id: "quote-negotiation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini drafts contextual quote requests with sufficient specification detail for accurate supplier pricing. Evaluates quote responses including caveats and conditions, then generates negotiation emails when quotes exceed benchmark range.

## Tools used

- [query_supplier_marketplaces_supplier_marketplaces_records](/tools/query-supplier-marketplaces-supplier-marketplaces-records.md)
- [query_email_api_email_api_records](/tools/query-email-api-email-api-records.md)
- [lookup_spot_buy_negotiation_agent_policy_guide](/tools/lookup-spot-buy-negotiation-agent-policy-guide.md)
- [action_coupa_draft](/tools/action-coupa-draft.md)

## Runs in

- [quote_negotiation](/workflow/quote-negotiation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Spot Buy Negotiation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spot-buy-negotiation-agent-end-to-end.md)

# Citations

- [Spot Buy Negotiation Agent Procurement Policy Guide](/documents/spot-buy-negotiation-agent-policy-guide.md)
