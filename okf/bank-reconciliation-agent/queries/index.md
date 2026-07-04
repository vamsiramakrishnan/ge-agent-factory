---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Ingest bank statements in MT940 and BAI2 formats across all banking relationships. Parse transaction details including amount, date, reference, and bank description fields.](/queries/statement-ingestion-parsing.md)
- [Match bank transactions against GL postings using ML model trained on historical reconciliation patterns. Categorize exceptions as timing differences, missing postings, or unknown. Auto-clear timing differences that resolve within the tolerance window.](/queries/automated-matching.md)
- [Gemini investigates unmatched items by interpreting bank descriptions: 'A $125K debit -- bank says WIRE OUT REF: LEGAL SETTLEMENT -- check legal department records. This was the Johnson litigation settlement authorized by the GC.' Provides resolution recommendation.](/queries/exception-investigation.md)
- [Post clearing entries for resolved items. Generate reconciliation report with matched totals, outstanding items, and investigation status for each bank account.](/queries/clearing-reporting.md)
