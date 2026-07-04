---
type: Query Capability
title: "Track routing accuracy — if tickets are rerouted, capture the correction to i..."
description: "Track routing accuracy — if tickets are rerouted, capture the correction to improve future classification. Monitor first-contact resolution rates by assignment group."
source_id: "feedback-learning"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Track routing accuracy — if tickets are rerouted, capture the correction to improve future classification. Monitor first-contact resolution rates by assignment group.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_intelligent_ticket_router_runbook](/tools/lookup-intelligent-ticket-router-runbook.md)
- [action_servicenow_route](/tools/action-servicenow-route.md)

## Runs in

- [feedback_learning](/workflow/feedback-learning.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Intelligent Ticket Router workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/intelligent-ticket-router-end-to-end.md)

# Citations

- [Intelligent Ticket Router Operations Runbook](/documents/intelligent-ticket-router-runbook.md)
