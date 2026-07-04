---
type: Eval Scenario
title: Run the Intelligent Ticket Router workflow for the current period. Cite the r...
description: "Run the Intelligent Ticket Router workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "intelligent-ticket-router-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Intelligent Ticket Router workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [multi-channel-intake](/queries/multi-channel-intake.md)

## Mechanisms to call

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_jira_service_mgmt_issues](/tools/query-jira-service-mgmt-issues.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_intelligent_ticket_router_runbook](/tools/lookup-intelligent-ticket-router-runbook.md)
- [action_servicenow_route](/tools/action-servicenow-route.md)

## Success rubric

Action route executed against ServiceNow, with audit-trail entry and IT Service Desk Manager notified of outcomes.

# Citations

- [Intelligent Ticket Router Operations Runbook](/documents/intelligent-ticket-router-runbook.md)
