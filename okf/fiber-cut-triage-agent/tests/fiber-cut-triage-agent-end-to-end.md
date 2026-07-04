---
type: Eval Scenario
title: Run the Fiber Cut Triage Agent workflow for the current period. Cite the rele...
description: "Run the Fiber Cut Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "fiber-cut-triage-agent-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Fiber Cut Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_fiber_cut_triage_agent_assurance_runbook](/tools/lookup-fiber-cut-triage-agent-assurance-runbook.md)
- [action_servicenow_route](/tools/action-servicenow-route.md)

## Success rubric

Action route executed against ServiceNow, with audit-trail entry and NOC Engineer notified of outcomes.

# Citations

- [Fiber Cut Triage Agent Service Assurance Runbook](/documents/fiber-cut-triage-agent-assurance-runbook.md)
