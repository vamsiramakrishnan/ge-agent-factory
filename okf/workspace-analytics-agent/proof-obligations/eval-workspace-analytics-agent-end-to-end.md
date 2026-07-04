---
type: Proof Obligation
title: "Golden eval obligation — Run the Workspace Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-workspace-analytics-agent-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Workspace Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [workspace-analytics-agent-end-to-end](/tests/workspace-analytics-agent-end-to-end.md)


## Mechanisms

- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_microsoft_365_microsoft_365_records](/tools/query-microsoft-365-microsoft-365-records.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_workspace_analytics_agent_runbook](/tools/lookup-workspace-analytics-agent-runbook.md)

## Entities that must be referenced

- accounts
- microsoft_365_records
- messages
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [workspace-analytics-agent-runbook](/documents/workspace-analytics-agent-runbook.md)
