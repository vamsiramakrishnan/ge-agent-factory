---
type: Workflow Stage
title: "Multi-Channel Intake"
description: "Receive tickets from ServiceNow portal, Jira Service Management, and Slack bot. Normalize into unified ticket schema with user metadata and department context."
source_id: multi_channel_intake
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Multi-Channel Intake

Receive tickets from ServiceNow portal, Jira Service Management, and Slack bot. Normalize into unified ticket schema with user metadata and department context.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_jira_service_mgmt_issues](/tools/query-jira-service-mgmt-issues.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_intelligent_ticket_router_runbook](/tools/lookup-intelligent-ticket-router-runbook.md)
- [action_servicenow_route](/tools/action-servicenow-route.md)

Next: [NLP Classification & Priority](/workflow/nlp-classification-priority.md)
