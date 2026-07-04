---
type: Workflow Stage
title: "Impact & Cost Scoring"
description: "Rank surviving requests by production impact and expedite cost using BigQuery analytics_events and historical_metrics (query_bigquery_analytics_events) against the quarterly expedite-cost baseline the Procurement Buyer reports against."
source_id: impact_cost_scoring
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Impact & Cost Scoring

Rank surviving requests by production impact and expedite cost using BigQuery analytics_events and historical_metrics (query_bigquery_analytics_events) against the quarterly expedite-cost baseline the Procurement Buyer reports against.

- **Mode:** sequential
- **Stage:** 4 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_expedite_request_triage_agent_sop](/tools/lookup-expedite-request-triage-agent-sop.md)

Next: [SOP & Rate-Schedule Evidence Gate](/workflow/sop-rate-schedule-evidence-gate.md)
