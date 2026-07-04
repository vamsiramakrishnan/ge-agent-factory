---
type: Workflow Stage
title: Baseline Variance Scoring
description: "Compare current-period analytics_events against historical_metrics and cached_aggregates in BigQuery (query_bigquery_analytics_events) to score the on-time completion and promo-verification gap and rank exceptions for the district queue."
source_id: baseline_variance_scoring
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Baseline Variance Scoring

Compare current-period analytics_events against historical_metrics and cached_aggregates in BigQuery (query_bigquery_analytics_events) to score the on-time completion and promo-verification gap and rank exceptions for the district queue.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_store_task_compliance_agent_execution_playbook](/tools/lookup-store-task-compliance-agent-execution-playbook.md)

Next: [Playbook & Standard Evidence Gate](/workflow/playbook-standard-evidence-gate.md)
