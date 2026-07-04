---
type: Query Capability
title: "For unresolved exceptions, LLM reads invoice descriptions for context: an inv..."
description: "For unresolved exceptions, LLM reads invoice descriptions for context: an invoice for $52,340 against a $50,000 PO where the description says 'includes $2,340 expedited shipping per email approval from John Smith' triggers a PO change order recommendation, not a rejection. Interprets credit memos with partial credits across multiple invoices."
source_id: "exception-reasoning"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# For unresolved exceptions, LLM reads invoice descriptions for context: an invoice for $52,340 against a $50,000 PO where the description says 'includes $2,340 expedited shipping per email approval from John Smith' triggers a PO change order recommendation, not a rejection. Interprets credit memos with partial credits across multiple invoices.

## Tools used

- [lookup_three_way_match_exception_handler_policy_guide](/tools/lookup-three-way-match-exception-handler-policy-guide.md)
- [action_sap_s_4hana_miro_mir7_recommend](/tools/action-sap-s-4hana-miro-mir7-recommend.md)

## Runs in

- [exception_reasoning](/workflow/exception-reasoning.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Three-Way Match Exception Handler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/three-way-match-exception-handler-end-to-end.md)

# Citations

- [Three-Way Match Exception Handler Procurement Policy Guide](/documents/three-way-match-exception-handler-policy-guide.md)
