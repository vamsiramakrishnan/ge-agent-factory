---
type: Workflow Stage
title: Context Retrieval
description: "Retrieve relevant documents from Confluence, project status from Jira, and analytics from BigQuery. Rank results by relevance and recency."
source_id: context_retrieval
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Context Retrieval

Retrieve relevant documents from Confluence, project status from Jira, and analytics from BigQuery. Rank results by relevance and recency.

- **Mode:** sequential
- **Stage:** 2 of 2

## Tools

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_strategic_initiative_q_a_runbook](/tools/lookup-strategic-initiative-q-a-runbook.md)
