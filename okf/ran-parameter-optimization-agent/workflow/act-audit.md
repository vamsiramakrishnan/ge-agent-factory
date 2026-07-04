---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the recommend step in Ericsson Network Manager with a full audit trail, and escalate exceptions to the RF Optimization Engineer."
source_id: act_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the recommend step in Ericsson Network Manager with a full audit trail, and escalate exceptions to the RF Optimization Engineer.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [lookup_ran_parameter_optimization_agent_assurance_runbook](/tools/lookup-ran-parameter-optimization-agent-assurance-runbook.md)
- [action_ericsson_network_manager_recommend](/tools/action-ericsson-network-manager-recommend.md)
