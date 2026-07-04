---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Aggregate pending invoices from SAP and Coupa across all entities. Expand the time window to catch duplicates submitted weeks apart.](/queries/invoice-aggregation.md)
- [Cluster invoices by features — amount, date, vendor, invoice number patterns. Apply fuzzy matching to catch near-duplicates with slight variations. Score duplicate probability.](/queries/ml-clustering-fuzzy-matching.md)
- [Gemini reads line item details on flagged clusters to distinguish true duplicates from legitimate similar invoices — e.g., monthly maintenance invoices for different periods.](/queries/contextual-differentiation.md)
- [Place payment holds on verified duplicates. Deliver report to AP Manager with explanations for each flagged pair.](/queries/hold-report.md)
