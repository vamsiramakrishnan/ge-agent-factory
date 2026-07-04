---
type: Workflow Stage
title: "Escalation, Ticketing & Audit Close-out"
description: "Open or update the linked ServiceNow ticket/incident, execute action_servicenow_escalate with the two-system evidence trail attached, and record the generated_audit_trail entry for the Service Assurance Manager."
source_id: escalation_ticketing_audit_close_out
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Escalation, Ticketing & Audit Close-out

Open or update the linked ServiceNow ticket/incident, execute action_servicenow_escalate with the two-system evidence trail attached, and record the generated_audit_trail entry for the Service Assurance Manager.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_network_slice_sla_monitor_assurance_runbook](/tools/lookup-network-slice-sla-monitor-assurance-runbook.md)
- [action_servicenow_escalate](/tools/action-servicenow-escalate.md)
