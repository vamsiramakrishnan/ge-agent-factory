---
type: Query Capability
title: Receive new document version from CLM. Retrieve previous version for comparis...
description: Receive new document version from CLM. Retrieve previous version for comparison. Normalize both versions from Word/Google Docs into comparable structured format.
source_id: "version-retrieval"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive new document version from CLM. Retrieve previous version for comparison. Normalize both versions from Word/Google Docs into comparable structured format.

## Tools used

- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [query_microsoft_word_microsoft_word_records](/tools/query-microsoft-word-microsoft-word-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [lookup_redline_comparison_agent_policy_guide](/tools/lookup-redline-comparison-agent-policy-guide.md)

## Runs in

- [version_retrieval](/workflow/version-retrieval.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Redline Comparison Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/redline-comparison-agent-end-to-end.md)

# Citations

- [Redline Comparison Agent Procurement Policy Guide](/documents/redline-comparison-agent-policy-guide.md)
