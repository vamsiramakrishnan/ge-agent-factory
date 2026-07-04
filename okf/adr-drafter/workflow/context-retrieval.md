---
type: Workflow Stage
title: Context Retrieval
description: "Pull existing ADRs from Confluence, system metadata from CMDB, and code structure from GitHub. Build a knowledge graph of prior decisions and their outcomes."
source_id: context_retrieval
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Context Retrieval

Pull existing ADRs from Confluence, system metadata from CMDB, and code structure from GitHub. Build a knowledge graph of prior decisions and their outcomes.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_servicenow_cmdb_tickets](/tools/query-servicenow-cmdb-tickets.md)
- [lookup_adr_drafter_runbook](/tools/lookup-adr-drafter-runbook.md)
- [action_confluence_generate](/tools/action-confluence-generate.md)

Next: [Publication](/workflow/publication.md)
