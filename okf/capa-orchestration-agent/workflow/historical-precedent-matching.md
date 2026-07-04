---
type: Workflow Stage
title: Historical Precedent Matching
description: "Query analytics_events and historical_metrics in BigQuery (query_bigquery_analytics_events) for prior capa_actions closed against the same defect_code and material_number, and propose a reusable root-cause narrative instead of drafting from a blank page."
source_id: historical_precedent_matching
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Historical Precedent Matching

Query analytics_events and historical_metrics in BigQuery (query_bigquery_analytics_events) for prior capa_actions closed against the same defect_code and material_number, and propose a reusable root-cause narrative instead of drafting from a blank page.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_capa_orchestration_agent_sop](/tools/lookup-capa-orchestration-agent-sop.md)

Next: [Root-Cause & Task Routing](/workflow/root-cause-task-routing.md)
