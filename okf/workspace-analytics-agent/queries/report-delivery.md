---
type: Query Capability
title: "Generate workspace analytics report with tool health scorecards, cost optimiz..."
description: "Generate workspace analytics report with tool health scorecards, cost optimization opportunities, and adoption recommendations. Publish to Looker dashboard."
source_id: "report-delivery"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate workspace analytics report with tool health scorecards, cost optimization opportunities, and adoption recommendations. Publish to Looker dashboard.

## Tools used

- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_workspace_analytics_agent_runbook](/tools/lookup-workspace-analytics-agent-runbook.md)

## Runs in

- [report_delivery](/workflow/report-delivery.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Workspace Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/workspace-analytics-agent-end-to-end.md)

# Citations

- [Workspace Analytics Agent Operations Runbook](/documents/workspace-analytics-agent-runbook.md)
