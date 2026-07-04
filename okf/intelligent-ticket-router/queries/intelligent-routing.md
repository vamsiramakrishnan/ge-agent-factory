---
type: Query Capability
title: "Route to optimal assignment group based on classification, agent skill matrix..."
description: "Route to optimal assignment group based on classification, agent skill matrix, current workload, and historical resolution patterns. Attach relevant KB articles."
source_id: "intelligent-routing"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Route to optimal assignment group based on classification, agent skill matrix, current workload, and historical resolution patterns. Attach relevant KB articles.

## Tools used

- [lookup_intelligent_ticket_router_runbook](/tools/lookup-intelligent-ticket-router-runbook.md)
- [action_servicenow_route](/tools/action-servicenow-route.md)

## Runs in

- [intelligent_routing](/workflow/intelligent-routing.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Intelligent Ticket Router workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/intelligent-ticket-router-end-to-end.md)

# Citations

- [Intelligent Ticket Router Operations Runbook](/documents/intelligent-ticket-router-runbook.md)
