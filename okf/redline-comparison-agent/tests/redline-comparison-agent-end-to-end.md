---
type: Eval Scenario
title: Run the Redline Comparison Agent workflow for the current period. Cite the re...
description: "Run the Redline Comparison Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "redline-comparison-agent-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Redline Comparison Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [version-retrieval](/queries/version-retrieval.md)

## Mechanisms to call

- [query_icertis_contracts](/tools/query-icertis-contracts.md)
- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [query_microsoft_word_microsoft_word_records](/tools/query-microsoft-word-microsoft-word-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [lookup_redline_comparison_agent_policy_guide](/tools/lookup-redline-comparison-agent-policy-guide.md)

## Success rubric

Contract Manager receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Redline Comparison Agent Procurement Policy Guide](/documents/redline-comparison-agent-policy-guide.md)
