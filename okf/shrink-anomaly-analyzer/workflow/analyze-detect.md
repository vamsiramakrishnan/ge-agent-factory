---
type: Workflow Stage
title: "Analyze & Detect"
description: "Compare current state against historical baselines and analytics events in BigQuery to detect gaps, score exceptions, and prioritize the Loss Prevention Manager's queue."
source_id: analyze_detect
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Analyze & Detect

Compare current state against historical baselines and analytics events in BigQuery to detect gaps, score exceptions, and prioritize the Loss Prevention Manager's queue.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_shrink_anomaly_analyzer_execution_playbook](/tools/lookup-shrink-anomaly-analyzer-execution-playbook.md)

Next: [Validate Evidence](/workflow/validate-evidence.md)
