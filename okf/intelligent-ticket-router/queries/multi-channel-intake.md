---
type: Query Capability
title: "Receive tickets from ServiceNow portal, Jira Service Management, and Slack bo..."
description: "Receive tickets from ServiceNow portal, Jira Service Management, and Slack bot. Normalize into unified ticket schema with user metadata and department context."
source_id: "multi-channel-intake"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive tickets from ServiceNow portal, Jira Service Management, and Slack bot. Normalize into unified ticket schema with user metadata and department context.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_jira_service_mgmt_issues](/tools/query-jira-service-mgmt-issues.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_intelligent_ticket_router_runbook](/tools/lookup-intelligent-ticket-router-runbook.md)
- [action_servicenow_route](/tools/action-servicenow-route.md)

## Runs in

- [multi_channel_intake](/workflow/multi-channel-intake.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Intelligent Ticket Router workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/intelligent-ticket-router-end-to-end.md)

# Citations

- [Intelligent Ticket Router Operations Runbook](/documents/intelligent-ticket-router-runbook.md)
