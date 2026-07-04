---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the escalate step in Ericsson Network Manager with a full audit trail, and escalate exceptions to the Service Assurance Manager."
source_id: act_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the escalate step in Ericsson Network Manager with a full audit trail, and escalate exceptions to the Service Assurance Manager.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [lookup_network_slice_sla_monitor_assurance_runbook](/tools/lookup-network-slice-sla-monitor-assurance-runbook.md)
- [action_servicenow_escalate](/tools/action-servicenow-escalate.md)
