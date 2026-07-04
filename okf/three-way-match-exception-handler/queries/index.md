---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Pull PO data and goods receipt from ERP, receive invoice from AP automation platform. Align line items across all three documents for matching.](/queries/data-assembly.md)
- [Execute matching with configurable tolerances. Auto-resolve common exceptions: quantity within tolerance, price rounding differences, tax calculation variances. Anomaly detection on discrepancy patterns.](/queries/fuzzy-matching-auto-resolution.md)
- [For unresolved exceptions, LLM reads invoice descriptions for context: an invoice for $52,340 against a $50,000 PO where the description says 'includes $2,340 expedited shipping per email approval from John Smith' triggers a PO change order recommendation, not a rejection. Interprets credit memos with partial credits across multiple invoices.](/queries/exception-reasoning.md)
- [Auto-post matched invoices. Route above-threshold exceptions with resolution recommendations and supporting evidence to AP Manager for review.](/queries/posting-escalation.md)
