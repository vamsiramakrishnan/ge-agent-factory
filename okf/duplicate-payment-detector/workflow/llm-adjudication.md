---
type: Workflow Stage
title: LLM Adjudication
description: "For medium-confidence matches, LLM reads line item descriptions and delivery references to determine if similar invoices are true duplicates or legitimate separate deliveries. Detects sophisticated patterns: same work submitted under different invoice numbers with slightly altered descriptions."
source_id: llm_adjudication
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# LLM Adjudication

For medium-confidence matches, LLM reads line item descriptions and delivery references to determine if similar invoices are true duplicates or legitimate separate deliveries. Detects sophisticated patterns: same work submitted under different invoice numbers with slightly altered descriptions.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [lookup_duplicate_payment_detector_policy_guide](/tools/lookup-duplicate-payment-detector-policy-guide.md)
- [action_sap_s_4hana_fi_submit](/tools/action-sap-s-4hana-fi-submit.md)

Next: [Hold & Escalation](/workflow/hold-escalation.md)
