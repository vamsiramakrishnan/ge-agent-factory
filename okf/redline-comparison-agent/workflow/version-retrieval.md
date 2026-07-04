---
type: Workflow Stage
title: Version Retrieval
description: Receive new document version from CLM. Retrieve previous version for comparison. Normalize both versions from Word/Google Docs into comparable structured format.
source_id: version_retrieval
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Version Retrieval

Receive new document version from CLM. Retrieve previous version for comparison. Normalize both versions from Word/Google Docs into comparable structured format.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [query_microsoft_word_microsoft_word_records](/tools/query-microsoft-word-microsoft-word-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [lookup_redline_comparison_agent_policy_guide](/tools/lookup-redline-comparison-agent-policy-guide.md)

Next: [Structural Diff Detection](/workflow/structural-diff-detection.md)
