---
type: Eval Scenario
title: "Run the Knowledge Base Auto-Resolver workflow for the current period. Cite th..."
description: "Run the Knowledge Base Auto-Resolver workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "knowledge-base-auto-resolver-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Knowledge Base Auto-Resolver workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [semantic-knowledge-retrieval](/queries/semantic-knowledge-retrieval.md)

## Mechanisms to call

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [lookup_knowledge_base_auto_resolver_runbook](/tools/lookup-knowledge-base-auto-resolver-runbook.md)
- [action_servicenow_update](/tools/action-servicenow-update.md)

## Success rubric

Action update executed against ServiceNow, with audit-trail entry and IT Service Desk Manager notified of outcomes.

# Citations

- [Knowledge Base Auto-Resolver Operations Runbook](/documents/knowledge-base-auto-resolver-runbook.md)
