---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the route step in Ericsson Network Manager with a full audit trail, and escalate exceptions to the NOC Engineer."
source_id: act_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the route step in Ericsson Network Manager with a full audit trail, and escalate exceptions to the NOC Engineer.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [lookup_alarm_noise_reduction_engine_assurance_runbook](/tools/lookup-alarm-noise-reduction-engine-assurance-runbook.md)
- [action_ericsson_network_manager_route](/tools/action-ericsson-network-manager-route.md)
