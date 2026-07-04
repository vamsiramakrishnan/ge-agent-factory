---
type: Eval Scenario
title: "Site 14832 in the Dallas-Fort Worth market shows PRB utilization at 92% in th..."
description: "Site 14832 in the Dallas-Fort Worth market shows PRB utilization at 92% in this week's performance_counters pull, but last week's cached BigQuery aggregate for the same cell reported 61% with no augment work order logged in between. network_alarms shows no active alarms for ne_id 218450. Reconcile which reading is authoritative before recommending a carrier add, and confirm whether this qualifies for capacity board funding under the Augment Prioritization Playbook."
source_id: "cell-congestion-forecasting-engine-conflicting-utilization"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Site 14832 in the Dallas-Fort Worth market shows PRB utilization at 92% in this week's performance_counters pull, but last week's cached BigQuery aggregate for the same cell reported 61% with no augment work order logged in between. network_alarms shows no active alarms for ne_id 218450. Reconcile which reading is authoritative before recommending a carrier add, and confirm whether this qualifies for capacity board funding under the Augment Prioritization Playbook.

## Validates

- [alarm-counter-intake](/queries/alarm-counter-intake.md)

## Mechanisms to call

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_cell_congestion_forecasting_engine_assurance_runbook](/tools/lookup-cell-congestion-forecasting-engine-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Cell Congestion Forecasting Engine Service Assurance Runbook](/documents/cell-congestion-forecasting-engine-assurance-runbook.md)
- [Cell Congestion Forecasting Engine Capacity Augment Prioritization Playbook](/documents/cell-congestion-augment-prioritization-playbook.md)
