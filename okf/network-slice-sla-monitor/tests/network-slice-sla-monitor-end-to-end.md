---
type: Eval Scenario
title: Run the 5G Network Slice SLA Monitor workflow for the current period. Cite th...
description: "Run the 5G Network Slice SLA Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "network-slice-sla-monitor-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the 5G Network Slice SLA Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_network_slice_sla_monitor_assurance_runbook](/tools/lookup-network-slice-sla-monitor-assurance-runbook.md)
- [action_servicenow_escalate](/tools/action-servicenow-escalate.md)

## Success rubric

Action escalate executed against ServiceNow, with audit-trail entry and Service Assurance Manager notified of outcomes.

# Citations

- [5G Network Slice SLA Monitor Service Assurance Runbook](/documents/network-slice-sla-monitor-assurance-runbook.md)
