---
type: Workflow Stage
title: "Topology & Timing Correlation"
description: "Correlate alarms by ne_id/site_id topology and first_occurrence timing, cross-referencing Splunk log_events and search_jobs through query_splunk_log_events to chain child alarms to a single root cause."
source_id: topology_timing_correlation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Topology & Timing Correlation

Correlate alarms by ne_id/site_id topology and first_occurrence timing, cross-referencing Splunk log_events and search_jobs through query_splunk_log_events to chain child alarms to a single root cause.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_alarm_noise_reduction_engine_assurance_runbook](/tools/lookup-alarm-noise-reduction-engine-assurance-runbook.md)

Next: [Baseline Deviation & Severity Scoring](/workflow/baseline-deviation-severity-scoring.md)
