---
type: Workflow Stage
title: "Multi-Platform Collection"
description: "Collect usage metrics from Google Workspace, Microsoft 365, Slack, and Zoom. Aggregate at user, team, and department levels. Calculate active usage vs. license allocation."
source_id: multi_platform_collection
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Multi-Platform Collection

Collect usage metrics from Google Workspace, Microsoft 365, Slack, and Zoom. Aggregate at user, team, and department levels. Calculate active usage vs. license allocation.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_microsoft_365_microsoft_365_records](/tools/query-microsoft-365-microsoft-365-records.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_workspace_analytics_agent_runbook](/tools/lookup-workspace-analytics-agent-runbook.md)

Next: [Insight Synthesis](/workflow/insight-synthesis.md)
