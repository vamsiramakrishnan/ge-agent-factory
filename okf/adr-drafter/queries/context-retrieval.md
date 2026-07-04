---
type: Query Capability
title: "Pull existing ADRs from Confluence, system metadata from CMDB, and code struc..."
description: "Pull existing ADRs from Confluence, system metadata from CMDB, and code structure from GitHub. Build a knowledge graph of prior decisions and their outcomes."
source_id: "context-retrieval"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull existing ADRs from Confluence, system metadata from CMDB, and code structure from GitHub. Build a knowledge graph of prior decisions and their outcomes.

## Tools used

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_servicenow_cmdb_tickets](/tools/query-servicenow-cmdb-tickets.md)
- [lookup_adr_drafter_runbook](/tools/lookup-adr-drafter-runbook.md)
- [action_confluence_generate](/tools/action-confluence-generate.md)

## Runs in

- [context_retrieval](/workflow/context-retrieval.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the ADR Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/adr-drafter-end-to-end.md)

# Citations

- [ADR Drafter Operations Runbook](/documents/adr-drafter-runbook.md)
