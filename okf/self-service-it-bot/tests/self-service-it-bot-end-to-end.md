---
type: Eval Scenario
title: "Run the Self-Service IT Bot workflow for the current period. Cite the relevan..."
description: "Run the Self-Service IT Bot workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "self-service-it-bot-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Self-Service IT Bot workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [knowledge-retrieval](/queries/knowledge-retrieval.md)

## Mechanisms to call

- [query_slack_messages](/tools/query-slack-messages.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_okta_users](/tools/query-okta-users.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [lookup_self_service_it_bot_runbook](/tools/lookup-self-service-it-bot-runbook.md)
- [action_slack_execute](/tools/action-slack-execute.md)

## Success rubric

Action execute executed against Slack, with audit-trail entry and End User Support Lead notified of outcomes.

# Citations

- [Self-Service IT Bot Operations Runbook](/documents/self-service-it-bot-runbook.md)
