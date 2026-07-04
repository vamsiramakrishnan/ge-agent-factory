---
type: Workflow Stage
title: Exception Reasoning
description: "For unresolved exceptions, LLM reads invoice descriptions for context: an invoice for $52,340 against a $50,000 PO where the description says 'includes $2,340 expedited shipping per email approval from John Smith' triggers a PO change order recommendation, not a rejection. Interprets credit memos with partial credits across multiple invoices."
source_id: exception_reasoning
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Exception Reasoning

For unresolved exceptions, LLM reads invoice descriptions for context: an invoice for $52,340 against a $50,000 PO where the description says 'includes $2,340 expedited shipping per email approval from John Smith' triggers a PO change order recommendation, not a rejection. Interprets credit memos with partial credits across multiple invoices.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [lookup_three_way_match_exception_handler_policy_guide](/tools/lookup-three-way-match-exception-handler-policy-guide.md)
- [action_sap_s_4hana_miro_mir7_recommend](/tools/action-sap-s-4hana-miro-mir7-recommend.md)

Next: [Posting & Escalation](/workflow/posting-escalation.md)
