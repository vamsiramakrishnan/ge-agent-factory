---
type: Query Capability
title: "Retrieve relevant documents from Confluence, project status from Jira, and an..."
description: "Retrieve relevant documents from Confluence, project status from Jira, and analytics from BigQuery. Rank results by relevance and recency."
source_id: "context-retrieval"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Retrieve relevant documents from Confluence, project status from Jira, and analytics from BigQuery. Rank results by relevance and recency.

## Tools used

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_strategic_initiative_q_a_runbook](/tools/lookup-strategic-initiative-q-a-runbook.md)

## Runs in

- [context_retrieval](/workflow/context-retrieval.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Strategic Initiative Q&A workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/strategic-initiative-q-a-end-to-end.md)

# Citations

- [Strategic Initiative Q&A Operations Runbook](/documents/strategic-initiative-q-a-runbook.md)
