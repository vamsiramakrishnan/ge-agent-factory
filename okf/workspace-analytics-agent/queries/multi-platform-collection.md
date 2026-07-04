---
type: Query Capability
title: "Collect usage metrics from Google Workspace, Microsoft 365, Slack, and Zoom. ..."
description: "Collect usage metrics from Google Workspace, Microsoft 365, Slack, and Zoom. Aggregate at user, team, and department levels. Calculate active usage vs. license allocation."
source_id: "multi-platform-collection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Collect usage metrics from Google Workspace, Microsoft 365, Slack, and Zoom. Aggregate at user, team, and department levels. Calculate active usage vs. license allocation.

## Tools used

- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_microsoft_365_microsoft_365_records](/tools/query-microsoft-365-microsoft-365-records.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_workspace_analytics_agent_runbook](/tools/lookup-workspace-analytics-agent-runbook.md)

## Runs in

- [multi_platform_collection](/workflow/multi-platform-collection.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Workspace Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/workspace-analytics-agent-end-to-end.md)

# Citations

- [Workspace Analytics Agent Operations Runbook](/documents/workspace-analytics-agent-runbook.md)
