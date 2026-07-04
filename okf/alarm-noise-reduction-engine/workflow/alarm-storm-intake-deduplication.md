---
type: Workflow Stage
title: "Alarm Storm Intake & Deduplication"
description: "Pull raw network_alarms and cell_sites records from Ericsson Network Manager via query_ericsson_network_manager_network_alarms, deduplicating flapping and sympathetic events before correlation begins."
source_id: alarm_storm_intake_deduplication
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Alarm Storm Intake & Deduplication

Pull raw network_alarms and cell_sites records from Ericsson Network Manager via query_ericsson_network_manager_network_alarms, deduplicating flapping and sympathetic events before correlation begins.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_alarm_noise_reduction_engine_assurance_runbook](/tools/lookup-alarm-noise-reduction-engine-assurance-runbook.md)
- [action_ericsson_network_manager_route](/tools/action-ericsson-network-manager-route.md)

Next: [Topology & Timing Correlation](/workflow/topology-timing-correlation.md)
