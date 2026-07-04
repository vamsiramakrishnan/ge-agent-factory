---
type: Workflow Stage
title: "Permit-Gated Work Order Triage"
description: "Query field_work_orders in Oracle Field Service for excavation- and install_fiber-flagged jobs by premise_id and dispatch_date, then pull open tickets and change_requests from ServiceNow for the same premise to surface conflicting dig or access requests before an application is drafted."
source_id: permit_gated_work_order_triage
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Permit-Gated Work Order Triage

Query field_work_orders in Oracle Field Service for excavation- and install_fiber-flagged jobs by premise_id and dispatch_date, then pull open tickets and change_requests from ServiceNow for the same premise to surface conflicting dig or access requests before an application is drafted.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_fiber_build_permitting_agent_assurance_runbook](/tools/lookup-fiber-build-permitting-agent-assurance-runbook.md)
- [action_oracle_field_service_escalate](/tools/action-oracle-field-service-escalate.md)

Next: [Crew & Locate Readiness Check](/workflow/crew-locate-readiness-check.md)
