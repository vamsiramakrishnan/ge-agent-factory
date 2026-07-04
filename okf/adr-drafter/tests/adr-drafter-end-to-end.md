---
type: Eval Scenario
title: Run the ADR Drafter workflow for the current period. Cite the relevant source...
description: "Run the ADR Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "adr-drafter-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the ADR Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [context-retrieval](/queries/context-retrieval.md)

## Mechanisms to call

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_servicenow_cmdb_tickets](/tools/query-servicenow-cmdb-tickets.md)
- [lookup_adr_drafter_runbook](/tools/lookup-adr-drafter-runbook.md)
- [action_confluence_generate](/tools/action-confluence-generate.md)

## Success rubric

Action generate executed against Confluence, with audit-trail entry and Enterprise Architect notified of outcomes.

# Citations

- [ADR Drafter Operations Runbook](/documents/adr-drafter-runbook.md)
