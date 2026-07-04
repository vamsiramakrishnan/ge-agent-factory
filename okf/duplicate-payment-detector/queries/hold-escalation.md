---
type: Query Capability
title: "Hold flagged payments in ERP. Present confidence scores, line item comparison..."
description: "Hold flagged payments in ERP. Present confidence scores, line item comparisons, and agent reasoning to AP Manager for final disposition. Log all decisions for audit trail."
source_id: "hold-escalation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Hold flagged payments in ERP. Present confidence scores, line item comparisons, and agent reasoning to AP Manager for final disposition. Log all decisions for audit trail.

## Tools used

- [query_coupa_pay_requisitions](/tools/query-coupa-pay-requisitions.md)
- [lookup_duplicate_payment_detector_policy_guide](/tools/lookup-duplicate-payment-detector-policy-guide.md)

## Runs in

- [hold_escalation](/workflow/hold-escalation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Duplicate Payment Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/duplicate-payment-detector-end-to-end.md)

# Citations

- [Duplicate Payment Detector Procurement Policy Guide](/documents/duplicate-payment-detector-policy-guide.md)
