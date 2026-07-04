---
type: Workflow Stage
title: "Aging & Severity Scoring"
description: "Score each open break's age off trade_date and its notional_amount against ISDA confirmation timeliness targets, using BigQuery analytics_events and historical_metrics baselines to prioritize the Treasury Operations Analyst's queue."
source_id: aging_severity_scoring
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Aging & Severity Scoring

Score each open break's age off trade_date and its notional_amount against ISDA confirmation timeliness targets, using BigQuery analytics_events and historical_metrics baselines to prioritize the Treasury Operations Analyst's queue.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_trade_confirmation_break_resolution_agent_compliance_policy](/tools/lookup-trade-confirmation-break-resolution-agent-compliance-policy.md)

Next: [Remediation Routing](/workflow/remediation-routing.md)
