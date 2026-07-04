---
type: Workflow Stage
title: "Root-Cause Pattern Match"
description: "Compare the current tender_type and settlement pattern against BigQuery historical_metrics, analytics_events, and cached_aggregates baselines to identify a known repeat-cause signature (tender driver fault, printer jam, network sync loss) rather than treating every incident as novel."
source_id: root_cause_pattern_match
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Root-Cause Pattern Match

Compare the current tender_type and settlement pattern against BigQuery historical_metrics, analytics_events, and cached_aggregates baselines to identify a known repeat-cause signature (tender driver fault, printer jam, network sync loss) rather than treating every incident as novel.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_pos_exception_triage_agent_execution_playbook](/tools/lookup-pos-exception-triage-agent-execution-playbook.md)

Next: [Playbook-Gated Severity Scoring](/workflow/playbook-gated-severity-scoring.md)
