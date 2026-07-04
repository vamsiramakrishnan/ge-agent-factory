---
type: Workflow Stage
title: "Pre-Payment Scan"
description: "Before each payment run, extract pending invoices from ERP. Cluster by amount, date, vendor, and invoice number patterns across time windows and legal entities."
source_id: pre_payment_scan
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pre-Payment Scan

Before each payment run, extract pending invoices from ERP. Cluster by amount, date, vendor, and invoice number patterns across time windows and legal entities.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_coupa_pay_requisitions](/tools/query-coupa-pay-requisitions.md)
- [lookup_duplicate_payment_detector_policy_guide](/tools/lookup-duplicate-payment-detector-policy-guide.md)

Next: [ML Clustering & Probability Scoring](/workflow/ml-clustering-probability-scoring.md)
