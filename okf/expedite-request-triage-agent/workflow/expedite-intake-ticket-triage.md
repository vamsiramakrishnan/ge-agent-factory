---
type: Workflow Stage
title: "Expedite Intake & Ticket Triage"
description: "Pull new expedite tickets from ServiceNow (query_servicenow_tickets) and capture the requested material_number, priority, and need date the Procurement Buyer must adjudicate before any supply check runs."
source_id: expedite_intake_ticket_triage
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Expedite Intake & Ticket Triage

Pull new expedite tickets from ServiceNow (query_servicenow_tickets) and capture the requested material_number, priority, and need date the Procurement Buyer must adjudicate before any supply check runs.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_expedite_request_triage_agent_sop](/tools/lookup-expedite-request-triage-agent-sop.md)

Next: [Requirement Date Reconciliation](/workflow/requirement-date-reconciliation.md)
