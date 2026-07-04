---
type: Workflow Stage
title: "Severity & Complexity Scoring"
description: "Compare incurred_amount, reserve_amount, and cat_code against BigQuery historical_metrics and analytics_events baselines (query_bigquery_analytics_events) to score severity and complexity, flagging stale or missing baseline evidence before it feeds a routing decision."
source_id: severity_complexity_scoring
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Severity & Complexity Scoring

Compare incurred_amount, reserve_amount, and cat_code against BigQuery historical_metrics and analytics_events baselines (query_bigquery_analytics_events) to score severity and complexity, flagging stale or missing baseline evidence before it feeds a routing decision.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_fnol_triage_routing_agent_authority_guide](/tools/lookup-fnol-triage-routing-agent-authority-guide.md)

Next: [Authority & Referral Validation](/workflow/authority-referral-validation.md)
