---
type: Workflow Stage
title: "Intent Classification & Routing"
description: "Classify the strategic question and route to appropriate data sources — Confluence for strategy docs, Jira for execution status, BigQuery for metrics."
source_id: intent_classification_routing
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Intent Classification & Routing

Classify the strategic question and route to appropriate data sources — Confluence for strategy docs, Jira for execution status, BigQuery for metrics.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_strategic_initiative_q_a_runbook](/tools/lookup-strategic-initiative-q-a-runbook.md)

Next: [Context Retrieval](/workflow/context-retrieval.md)
