---
type: Workflow Stage
title: Retrieve Records
description: Query network alarms and cell sites from Ericsson Network Manager and correlate with ServiceNow for the Fiber Cut Triage Agent workflow.
source_id: retrieve_records
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query network alarms and cell sites from Ericsson Network Manager and correlate with ServiceNow for the Fiber Cut Triage Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_fiber_cut_triage_agent_assurance_runbook](/tools/lookup-fiber-cut-triage-agent-assurance-runbook.md)
- [action_servicenow_route](/tools/action-servicenow-route.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
