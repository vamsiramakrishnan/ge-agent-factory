---
type: Workflow Stage
title: "Exception Scoring & Queue Prioritization"
description: "Score exceptions surfaced from analytics_events and cached_aggregates, then use Looker dashboards and metric_definitions to prioritize the Regulatory Affairs Manager's remediation queue before an exam is announced."
source_id: exception_scoring_queue_prioritization
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Exception Scoring & Queue Prioritization

Score exceptions surfaced from analytics_events and cached_aggregates, then use Looker dashboards and metric_definitions to prioritize the Regulatory Affairs Manager's remediation queue before an exam is announced.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_market_conduct_exam_prep_orchestrator_authority_guide](/tools/lookup-market-conduct-exam-prep-orchestrator-authority-guide.md)

Next: [Authority & Evidence Citation Gate](/workflow/authority-evidence-citation-gate.md)
