---
type: Eval Scenario
title: "For site 15590 (Chicago Metro, rooftop, lit_ethernet backhaul), the last perf..."
description: "For site 15590 (Chicago Metro, rooftop, lit_ethernet backhaul), the last performance_counters interval on file is 30 hours old and shows PRB utilization at 86.4%, just over the 85% congestion threshold. There's an open major-severity vswr_alarm from 6 hours ago on a co-located sector. Decide whether to publish an augment recommendation to the capacity board now or hold, and cite what evidence you need."
source_id: "cell-congestion-forecasting-engine-stale-threshold-edge"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# For site 15590 (Chicago Metro, rooftop, lit_ethernet backhaul), the last performance_counters interval on file is 30 hours old and shows PRB utilization at 86.4%, just over the 85% congestion threshold. There's an open major-severity vswr_alarm from 6 hours ago on a co-located sector. Decide whether to publish an augment recommendation to the capacity board now or hold, and cite what evidence you need.

## Validates

- [alarm-counter-intake](/queries/alarm-counter-intake.md)

## Mechanisms to call

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [lookup_cell_congestion_forecasting_engine_assurance_runbook](/tools/lookup-cell-congestion-forecasting-engine-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Cell Congestion Forecasting Engine Service Assurance Runbook](/documents/cell-congestion-forecasting-engine-assurance-runbook.md)
- [Cell Congestion Forecasting Engine Capacity Augment Prioritization Playbook](/documents/cell-congestion-augment-prioritization-playbook.md)
