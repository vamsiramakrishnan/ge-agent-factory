---
type: Eval Scenario
title: Run the Workspace Analytics Agent workflow for the current period. Cite the r...
description: "Run the Workspace Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "workspace-analytics-agent-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Workspace Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [multi-platform-collection](/queries/multi-platform-collection.md)

## Mechanisms to call

- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_microsoft_365_microsoft_365_records](/tools/query-microsoft-365-microsoft-365-records.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_workspace_analytics_agent_runbook](/tools/lookup-workspace-analytics-agent-runbook.md)

## Success rubric

End User Support Lead receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Workspace Analytics Agent Operations Runbook](/documents/workspace-analytics-agent-runbook.md)
