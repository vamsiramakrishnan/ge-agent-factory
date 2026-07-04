---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Distribute CMRT/CRT questionnaires to tier-1 suppliers, collect responses, and ingest Resilinc/Everstream sub-tier supplier data. Parse responses for sub-tier entity names, locations, and material flows.](/queries/sub-tier-data-collection.md)
- [Build multi-tier supply network graph in BigQuery. Run risk propagation modeling — if a tier-2 supplier fails, which tier-1 suppliers and which products are affected? Concentration analysis at each tier level.](/queries/graph-analytics-risk-propagation.md)
- [Gemini reads inconsistently filled CMRT responses and extracts meaningful sub-tier information. Reasons about topology: 'Supplier A and Supplier B list different sub-supplier names but addresses suggest the same Japanese industrial park — possible single-point-of-failure.' Flags vague disclosures ('we source from multiple qualified suppliers in Asia') for specificity.](/queries/topology-reasoning-from-partial-data.md)
