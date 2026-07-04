---
type: Workflow Stage
title: "Capacity Board Publish & Audit"
description: "Publish the ranked augment plan into Ericsson Network Manager (action_ericsson_network_manager_publish) with a full audit trail, and escalate any gated exceptions to the Capacity Planner or the capacity board."
source_id: capacity_board_publish_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Capacity Board Publish & Audit

Publish the ranked augment plan into Ericsson Network Manager (action_ericsson_network_manager_publish) with a full audit trail, and escalate any gated exceptions to the Capacity Planner or the capacity board.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [lookup_cell_congestion_forecasting_engine_assurance_runbook](/tools/lookup-cell-congestion-forecasting-engine-assurance-runbook.md)
- [action_ericsson_network_manager_publish](/tools/action-ericsson-network-manager-publish.md)
