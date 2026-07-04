---
type: Eval Scenario
title: "Run the AI Ethics & Bias Monitor workflow for the current period. Cite the re..."
description: "Run the AI Ethics & Bias Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "ai-ethics-bias-monitor-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the AI Ethics & Bias Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [gemini-contextualizes-bias-findings-distinguishing-proxy-feature](/queries/gemini-contextualizes-bias-findings-distinguishing-proxy-feature.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_it_2_it_2_records](/tools/query-it-2-it-2-records.md)
- [query_it_3_it_3_records](/tools/query-it-3-it-3-records.md)
- [lookup_ai_ethics_bias_monitor_runbook](/tools/lookup-ai-ethics-bias-monitor-runbook.md)
- [action_it_2_recommend](/tools/action-it-2-recommend.md)

## Success rubric

Action recommend executed against IT 2, with audit-trail entry and Data Platform Lead notified of outcomes.

# Citations

- [AI Ethics & Bias Monitor Operations Runbook](/documents/ai-ethics-bias-monitor-runbook.md)
