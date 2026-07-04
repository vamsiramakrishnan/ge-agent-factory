---
type: Workflow Stage
title: "Document Ingestion & Parsing"
description: "Receive redlined or counterparty draft from CLM. Parse document into clause-level segments with boundary detection and section classification."
source_id: document_ingestion_parsing
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Document Ingestion & Parsing

Receive redlined or counterparty draft from CLM. Parse document into clause-level segments with boundary detection and section classification.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [lookup_clause_risk_analyzer_policy_guide](/tools/lookup-clause-risk-analyzer-policy-guide.md)

Next: [Deviation Scoring](/workflow/deviation-scoring.md)
