---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Receive new amendment, SOW, or change order. Link to parent agreement in CLM. Update relationship graph in BigQuery: MSA to SOW to amendments to change orders to POs. Validate linkages on each new document.](/queries/document-ingestion-linking.md)
- [Knowledge graph construction with lineage tracking. Detect orphan POs without valid parent agreements. Identify POs referencing expired or incorrect contracts. Track graph completeness metrics.](/queries/graph-analytics-orphan-detection.md)
- [Gemini reads amendments and determines scope — 'Amendment 5 updates Exhibit B pricing but states all other terms unchanged, confirming Amendments 3 and 4 still effective.' Resolves inheritance ambiguity when MSA and SOW conflict on terms. Detects when change orders create new scope that should be a separate SOW.](/queries/conflict-scope-resolution.md)
