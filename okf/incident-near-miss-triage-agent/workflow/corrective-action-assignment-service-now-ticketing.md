---
type: Workflow Stage
title: "Corrective-Action Assignment & ServiceNow Ticketing"
description: "Open or update corrective-action tickets in ServiceNow (query_servicenow_tickets), assign an owner, and flag any ticket whose sla_met is false and created_at is aging past policy."
source_id: corrective_action_assignment_service_now_ticketing
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Corrective-Action Assignment & ServiceNow Ticketing

Open or update corrective-action tickets in ServiceNow (query_servicenow_tickets), assign an owner, and flag any ticket whose sla_met is false and created_at is aging past policy.

- **Mode:** sequential
- **Stage:** 5 of 6

## Tools

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)

Next: [Escalation & Audit Closeout](/workflow/escalation-audit-closeout.md)
