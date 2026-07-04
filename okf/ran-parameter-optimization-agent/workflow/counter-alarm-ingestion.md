---
type: Workflow Stage
title: "Counter & Alarm Ingestion"
description: "Pull performance_counters (RSRP, SINR, RRC setup success, VoLTE drop rate) and network_alarms for the target clusters from Ericsson Network Manager."
source_id: counter_alarm_ingestion
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Counter & Alarm Ingestion

Pull performance_counters (RSRP, SINR, RRC setup success, VoLTE drop rate) and network_alarms for the target clusters from Ericsson Network Manager.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [lookup_ran_parameter_optimization_agent_assurance_runbook](/tools/lookup-ran-parameter-optimization-agent-assurance-runbook.md)
- [action_ericsson_network_manager_recommend](/tools/action-ericsson-network-manager-recommend.md)

Next: [Cluster Baseline Comparison](/workflow/cluster-baseline-comparison.md)
