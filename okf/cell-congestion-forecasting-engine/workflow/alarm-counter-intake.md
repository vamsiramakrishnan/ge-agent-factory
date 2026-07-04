---
type: Workflow Stage
title: "Alarm & Counter Intake"
description: "Pull network_alarms, cell_sites, and performance_counters from Ericsson Network Manager (query_ericsson_network_manager_network_alarms) to establish current PRB utilization, RSRP/SINR, and open-fault context for every site before any forecast is trusted."
source_id: alarm_counter_intake
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Alarm & Counter Intake

Pull network_alarms, cell_sites, and performance_counters from Ericsson Network Manager (query_ericsson_network_manager_network_alarms) to establish current PRB utilization, RSRP/SINR, and open-fault context for every site before any forecast is trusted.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [lookup_cell_congestion_forecasting_engine_assurance_runbook](/tools/lookup-cell-congestion-forecasting-engine-assurance-runbook.md)
- [action_ericsson_network_manager_publish](/tools/action-ericsson-network-manager-publish.md)

Next: [Baseline & Seasonality Trending](/workflow/baseline-seasonality-trending.md)
