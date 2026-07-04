---
type: Query Capability
title: "Before each payment run, extract pending invoices from ERP. Cluster by amount..."
description: "Before each payment run, extract pending invoices from ERP. Cluster by amount, date, vendor, and invoice number patterns across time windows and legal entities."
source_id: "pre-payment-scan"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Before each payment run, extract pending invoices from ERP. Cluster by amount, date, vendor, and invoice number patterns across time windows and legal entities.

## Tools used

- [query_coupa_pay_requisitions](/tools/query-coupa-pay-requisitions.md)
- [lookup_duplicate_payment_detector_policy_guide](/tools/lookup-duplicate-payment-detector-policy-guide.md)

## Runs in

- [pre_payment_scan](/workflow/pre-payment-scan.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Duplicate Payment Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/duplicate-payment-detector-end-to-end.md)

# Citations

- [Duplicate Payment Detector Procurement Policy Guide](/documents/duplicate-payment-detector-policy-guide.md)
