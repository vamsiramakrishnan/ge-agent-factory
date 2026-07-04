---
type: Query Capability
title: "Ingest remittance data from lockbox files, electronic payments, and wire tran..."
description: "Ingest remittance data from lockbox files, electronic payments, and wire transfers. Parse BAI2/MT940 formats and extract payer, amount, and reference fields."
source_id: "payment-ingestion"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest remittance data from lockbox files, electronic payments, and wire transfers. Parse BAI2/MT940 formats and extract payer, amount, and reference fields.

## Tools used

- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)

## Runs in

- [payment_ingestion](/workflow/payment-ingestion.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Cash Application Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cash-application-agent-end-to-end.md)

# Citations

- [Cash Application Agent Controls Playbook](/documents/cash-application-agent-controls-playbook.md)
