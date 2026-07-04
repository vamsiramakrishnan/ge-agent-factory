---
type: Workflow Stage
title: Payment Ingestion
description: "Ingest remittance data from lockbox files, electronic payments, and wire transfers. Parse BAI2/MT940 formats and extract payer, amount, and reference fields."
source_id: payment_ingestion
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Payment Ingestion

Ingest remittance data from lockbox files, electronic payments, and wire transfers. Parse BAI2/MT940 formats and extract payer, amount, and reference fields.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)

Next: [ML Invoice Matching](/workflow/ml-invoice-matching.md)
