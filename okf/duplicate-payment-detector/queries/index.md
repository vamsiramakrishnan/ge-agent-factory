---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Before each payment run, extract pending invoices from ERP. Cluster by amount, date, vendor, and invoice number patterns across time windows and legal entities.](/queries/pre-payment-scan.md)
- [Fuzzy matching across invoice features with statistical duplicate probability scoring. Detect patterns including same vendor/similar amount across time windows and across legal entities. Score each cluster with duplicate probability.](/queries/ml-clustering-probability-scoring.md)
- [For medium-confidence matches, LLM reads line item descriptions and delivery references to determine if similar invoices are true duplicates or legitimate separate deliveries. Detects sophisticated patterns: same work submitted under different invoice numbers with slightly altered descriptions.](/queries/llm-adjudication.md)
- [Hold flagged payments in ERP. Present confidence scores, line item comparisons, and agent reasoning to AP Manager for final disposition. Log all decisions for audit trail.](/queries/hold-escalation.md)
