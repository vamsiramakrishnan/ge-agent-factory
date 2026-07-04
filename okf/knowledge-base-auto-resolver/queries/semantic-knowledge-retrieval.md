---
type: Query Capability
title: "Search knowledge base articles, Confluence runbooks, and historical ticket re..."
description: "Search knowledge base articles, Confluence runbooks, and historical ticket resolutions using semantic similarity. Rank by relevance and recency."
source_id: "semantic-knowledge-retrieval"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Search knowledge base articles, Confluence runbooks, and historical ticket resolutions using semantic similarity. Rank by relevance and recency.

## Tools used

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [lookup_knowledge_base_auto_resolver_runbook](/tools/lookup-knowledge-base-auto-resolver-runbook.md)

## Runs in

- [semantic_knowledge_retrieval](/workflow/semantic-knowledge-retrieval.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Knowledge Base Auto-Resolver workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/knowledge-base-auto-resolver-end-to-end.md)

# Citations

- [Knowledge Base Auto-Resolver Operations Runbook](/documents/knowledge-base-auto-resolver-runbook.md)
