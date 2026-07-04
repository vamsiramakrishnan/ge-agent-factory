---
type: Workflow Stage
title: "Root-Cause & Trend Analysis"
description: "Query BigQuery analytics_events, historical_metrics, and cached_aggregates to compare the complaint against historical baselines and detect recurring servicing or coverage-interpretation themes."
source_id: root_cause_trend_analysis
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Root-Cause & Trend Analysis

Query BigQuery analytics_events, historical_metrics, and cached_aggregates to compare the complaint against historical baselines and detect recurring servicing or coverage-interpretation themes.

- **Mode:** sequential
- **Stage:** 4 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_regulatory_complaint_response_agent_authority_guide](/tools/lookup-regulatory-complaint-response-agent-authority-guide.md)

Next: [Regulator Response Drafting & Deadline Tracking](/workflow/regulator-response-drafting-deadline-tracking.md)
