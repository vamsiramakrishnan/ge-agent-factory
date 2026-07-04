---
type: Workflow Stage
title: "Reroute, Route & Notify"
description: "Trigger the automatic traffic reroute where a protection path exists, execute action_servicenow_route to open the master incident and route the ServiceNow ticket, and notify the NOC Engineer and affected enterprise customers with the audit trail attached."
source_id: reroute_route_notify
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Reroute, Route & Notify

Trigger the automatic traffic reroute where a protection path exists, execute action_servicenow_route to open the master incident and route the ServiceNow ticket, and notify the NOC Engineer and affected enterprise customers with the audit trail attached.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [action_servicenow_route](/tools/action-servicenow-route.md)
