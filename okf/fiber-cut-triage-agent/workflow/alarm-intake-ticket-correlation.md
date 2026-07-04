---
type: Workflow Stage
title: "Alarm Intake & Ticket Correlation"
description: Pull new network_alarms from Ericsson Network Manager via query_ericsson_network_manager_network_alarms and correlate alarm_id/ne_id/site_id against open tickets and incidents in ServiceNow to confirm this is a backbone fiber_cut rather than a transient link_down or high_ber flap.
source_id: alarm_intake_ticket_correlation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Alarm Intake & Ticket Correlation

Pull new network_alarms from Ericsson Network Manager via query_ericsson_network_manager_network_alarms and correlate alarm_id/ne_id/site_id against open tickets and incidents in ServiceNow to confirm this is a backbone fiber_cut rather than a transient link_down or high_ber flap.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_fiber_cut_triage_agent_assurance_runbook](/tools/lookup-fiber-cut-triage-agent-assurance-runbook.md)
- [action_servicenow_route](/tools/action-servicenow-route.md)

Next: [Blast-Radius & Severity Scoring](/workflow/blast-radius-severity-scoring.md)
