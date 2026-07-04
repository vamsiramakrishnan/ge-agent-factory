---
type: Eval Scenario
title: "Parameter change action ENM-88213 was pushed to cell 15630 four days ago to f..."
description: "Parameter change action ENM-88213 was pushed to cell 15630 four days ago to fix its VoLTE drop rate; the last performance_counters refresh for that cell is timestamped 2026-06-29 (5 days old) and cell_availability_pct hasn't updated since. Confirm whether the change held and can be closed out."
source_id: "ran-parameter-optimization-agent-stale-verification-window"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Parameter change action ENM-88213 was pushed to cell 15630 four days ago to fix its VoLTE drop rate; the last performance_counters refresh for that cell is timestamped 2026-06-29 (5 days old) and cell_availability_pct hasn't updated since. Confirm whether the change held and can be closed out.

## Validates

- [counter-alarm-ingestion](/queries/counter-alarm-ingestion.md)

## Mechanisms to call

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_ran_parameter_optimization_agent_assurance_runbook](/tools/lookup-ran-parameter-optimization-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [RAN Parameter Optimization Agent Service Assurance Runbook](/documents/ran-parameter-optimization-agent-assurance-runbook.md)
- [RAN Parameter Change Control & Rollback Playbook](/documents/ran-parameter-change-control-playbook.md)
