---
type: Workflow Stage
title: Failure Signature Correlation
description: "Compare the event against historical_metrics, cached_aggregates, and analytics_events in BigQuery using query_bigquery_historical_metrics, query_bigquery_cached_aggregates, and query_bigquery_analytics_events to rank candidate root-cause hypotheses and flag constraint_asset exposure."
source_id: failure_signature_correlation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Failure Signature Correlation

Compare the event against historical_metrics, cached_aggregates, and analytics_events in BigQuery using query_bigquery_historical_metrics, query_bigquery_cached_aggregates, and query_bigquery_analytics_events to rank candidate root-cause hypotheses and flag constraint_asset exposure.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_unplanned_downtime_root_cause_agent_sop](/tools/lookup-unplanned-downtime-root-cause-agent-sop.md)

Next: [SOP & Reason-Code Evidence Gate](/workflow/sop-reason-code-evidence-gate.md)
