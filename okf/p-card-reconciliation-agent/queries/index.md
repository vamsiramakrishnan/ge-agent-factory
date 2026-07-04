---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Ingest card transaction feed from commercial card provider at statement close. Match transactions against receipt images in Concur. Identify transactions lacking supporting documentation.](/queries/transaction-ingestion.md)
- [Categorize transactions to UNSPSC/GL codes using merchant codes and historical patterns. OCR receipt matching for documentation. Anomaly detection on spending patterns — unusual merchant, time of day, amount relative to cardholder history.](/queries/auto-categorization-anomaly-detection.md)
- [Decode cryptic merchant descriptions ('SQ *HARDWARE STORE #4521', 'AMZN MKTP US*2K4TH1') and map to correct spend categories. Read receipt images with handwritten notes ('team lunch — 8 attendees') and validate against per-person meal policy limits. Flag policy gaming: 'Expenses consistently at $1 below manager-approval threshold.'](/queries/llm-interpretation-policy-validation.md)
- [Generate reconciliation report with policy violations and suspicious patterns flagged with context for manager review. Route compliant transactions for auto-posting.](/queries/exception-reporting-reconciliation.md)
