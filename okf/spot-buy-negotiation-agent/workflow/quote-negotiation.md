---
type: Workflow Stage
title: "Quote & Negotiation"
description: "Gemini drafts contextual quote requests with sufficient specification detail for accurate supplier pricing. Evaluates quote responses including caveats and conditions, then generates negotiation emails when quotes exceed benchmark range."
source_id: quote_negotiation
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Quote & Negotiation

Gemini drafts contextual quote requests with sufficient specification detail for accurate supplier pricing. Evaluates quote responses including caveats and conditions, then generates negotiation emails when quotes exceed benchmark range.

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [query_supplier_marketplaces_supplier_marketplaces_records](/tools/query-supplier-marketplaces-supplier-marketplaces-records.md)
- [query_email_api_email_api_records](/tools/query-email-api-email-api-records.md)
- [lookup_spot_buy_negotiation_agent_policy_guide](/tools/lookup-spot-buy-negotiation-agent-policy-guide.md)
- [action_coupa_draft](/tools/action-coupa-draft.md)

Next: [PO Execution](/workflow/po-execution.md)
