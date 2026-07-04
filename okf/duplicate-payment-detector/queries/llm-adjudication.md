---
type: Query Capability
title: "For medium-confidence matches, LLM reads line item descriptions and delivery ..."
description: "For medium-confidence matches, LLM reads line item descriptions and delivery references to determine if similar invoices are true duplicates or legitimate separate deliveries. Detects sophisticated patterns: same work submitted under different invoice numbers with slightly altered descriptions."
source_id: "llm-adjudication"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# For medium-confidence matches, LLM reads line item descriptions and delivery references to determine if similar invoices are true duplicates or legitimate separate deliveries. Detects sophisticated patterns: same work submitted under different invoice numbers with slightly altered descriptions.

## Tools used

- [lookup_duplicate_payment_detector_policy_guide](/tools/lookup-duplicate-payment-detector-policy-guide.md)
- [action_sap_s_4hana_fi_submit](/tools/action-sap-s-4hana-fi-submit.md)

## Runs in

- [llm_adjudication](/workflow/llm-adjudication.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Duplicate Payment Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/duplicate-payment-detector-end-to-end.md)

# Citations

- [Duplicate Payment Detector Procurement Policy Guide](/documents/duplicate-payment-detector-policy-guide.md)
