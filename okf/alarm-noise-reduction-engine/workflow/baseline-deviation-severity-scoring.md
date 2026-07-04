---
type: Workflow Stage
title: "Baseline Deviation & Severity Scoring"
description: "Compare current severity and probable_cause distributions against historical_metrics and analytics_events in BigQuery via query_bigquery_analytics_events to score exception significance and prioritize the NOC Engineer's queue."
source_id: baseline_deviation_severity_scoring
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Baseline Deviation & Severity Scoring

Compare current severity and probable_cause distributions against historical_metrics and analytics_events in BigQuery via query_bigquery_analytics_events to score exception significance and prioritize the NOC Engineer's queue.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_alarm_noise_reduction_engine_assurance_runbook](/tools/lookup-alarm-noise-reduction-engine-assurance-runbook.md)

Next: [Runbook-Gated Evidence Validation](/workflow/runbook-gated-evidence-validation.md)
