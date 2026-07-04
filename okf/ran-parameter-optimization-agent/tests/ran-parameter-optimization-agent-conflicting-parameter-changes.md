---
type: Eval Scenario
title: "Site 14892 in the Dallas-Ft Worth market has a pending tilt increase from the..."
description: "Site 14892 in the Dallas-Ft Worth market has a pending tilt increase from the coverage team (change ticket 2043211) queued for this Thursday's window, and performance_counters show PRB utilization already at 91% with an energy-saving power reduction applied to the same site last Tuesday. Recommend whether to proceed with the tilt change for this week's cluster review."
source_id: "ran-parameter-optimization-agent-conflicting-parameter-changes"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Site 14892 in the Dallas-Ft Worth market has a pending tilt increase from the coverage team (change ticket 2043211) queued for this Thursday's window, and performance_counters show PRB utilization already at 91% with an energy-saving power reduction applied to the same site last Tuesday. Recommend whether to proceed with the tilt change for this week's cluster review.

## Validates

- [counter-alarm-ingestion](/queries/counter-alarm-ingestion.md)

## Mechanisms to call

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_ran_parameter_optimization_agent_assurance_runbook](/tools/lookup-ran-parameter-optimization-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [RAN Parameter Change Control & Rollback Playbook](/documents/ran-parameter-change-control-playbook.md)
- [RAN Parameter Optimization Agent Service Assurance Runbook](/documents/ran-parameter-optimization-agent-assurance-runbook.md)
