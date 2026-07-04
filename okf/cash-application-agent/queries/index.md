---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Ingest remittance data from lockbox files, electronic payments, and wire transfers. Parse BAI2/MT940 formats and extract payer, amount, and reference fields.](/queries/payment-ingestion.md)
- [Match payments to open invoices using ML model trained on historical application patterns. Score matches by confidence considering amount, customer, date, and reference patterns. Auto-post above 95% confidence threshold.](/queries/ml-invoice-matching.md)
- [Post matched and validated payments to AR sub-ledger. Route remaining exceptions to AR specialists with context and suggested resolution.](/queries/posting-exception-routing.md)
