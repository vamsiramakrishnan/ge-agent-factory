---
type: Query Capability
title: Search ServiceNow KB and Confluence for matching resolution articles. Rank by...
description: Search ServiceNow KB and Confluence for matching resolution articles. Rank by relevance and recency. Check for known outages or recent changes that might explain the issue.
source_id: "knowledge-retrieval"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Search ServiceNow KB and Confluence for matching resolution articles. Rank by relevance and recency. Check for known outages or recent changes that might explain the issue.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_self_service_it_bot_runbook](/tools/lookup-self-service-it-bot-runbook.md)

## Runs in

- [knowledge_retrieval](/workflow/knowledge-retrieval.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Self-Service IT Bot workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/self-service-it-bot-end-to-end.md)

# Citations

- [Self-Service IT Bot Operations Runbook](/documents/self-service-it-bot-runbook.md)
