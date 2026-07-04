---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Pull savings pipeline data from Coupa and Ariba sourcing modules. Match contracted prices against actual PO prices in ERP. Feed matched data into BigQuery and Looker dashboards.](/queries/pipeline-data-ingestion.md)
- [Classify savings type — hard negotiated, soft, cost avoidance, demand reduction. Score realization probability based on historical conversion rates. Detect price drift via statistical leakage analysis.](/queries/savings-classification-scoring.md)
- [Gemini interprets why savings leaked — reads PO exception context: 'supplier couldn't meet delivery, switched to alternate at higher price' vs. 'requester specified brand name, bypassed contract.' Generates a narrative savings report explaining the gap between identified and realized savings in business terms.](/queries/leakage-narrative-cpo-report.md)
