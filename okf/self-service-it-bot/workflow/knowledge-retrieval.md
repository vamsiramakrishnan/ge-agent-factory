---
type: Workflow Stage
title: Knowledge Retrieval
description: Search ServiceNow KB and Confluence for matching resolution articles. Rank by relevance and recency. Check for known outages or recent changes that might explain the issue.
source_id: knowledge_retrieval
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Knowledge Retrieval

Search ServiceNow KB and Confluence for matching resolution articles. Rank by relevance and recency. Check for known outages or recent changes that might explain the issue.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_self_service_it_bot_runbook](/tools/lookup-self-service-it-bot-runbook.md)

Next: [Resolution Execution](/workflow/resolution-execution.md)
