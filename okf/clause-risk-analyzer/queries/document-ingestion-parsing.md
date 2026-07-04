---
type: Query Capability
title: "Receive redlined or counterparty draft from CLM. Parse document into clause-l..."
description: "Receive redlined or counterparty draft from CLM. Parse document into clause-level segments with boundary detection and section classification."
source_id: "document-ingestion-parsing"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive redlined or counterparty draft from CLM. Parse document into clause-level segments with boundary detection and section classification.

## Tools used

- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [lookup_clause_risk_analyzer_policy_guide](/tools/lookup-clause-risk-analyzer-policy-guide.md)

## Runs in

- [document_ingestion_parsing](/workflow/document-ingestion-parsing.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Clause Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/clause-risk-analyzer-end-to-end.md)

# Citations

- [Clause Risk Analyzer Procurement Policy Guide](/documents/clause-risk-analyzer-policy-guide.md)
