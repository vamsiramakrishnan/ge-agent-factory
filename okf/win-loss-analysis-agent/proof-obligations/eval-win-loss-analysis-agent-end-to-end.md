---
type: Proof Obligation
title: "Golden eval obligation — Run the Win/Loss Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-win-loss-analysis-agent-end-to-end"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Win/Loss Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [win-loss-analysis-agent-end-to-end](/tests/win-loss-analysis-agent-end-to-end.md)


## Mechanisms

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_gong_gong_records](/tools/query-gong-gong-records.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_win_loss_analysis_agent_playbook](/tools/lookup-win-loss-analysis-agent-playbook.md)
- [action_salesforce_crm_route](/tools/action-salesforce-crm-route.md)

## Entities that must be referenced

- accounts
- gong_records
- accounts
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute route without two-system evidence

# Citations

- [win-loss-analysis-agent-playbook](/documents/win-loss-analysis-agent-playbook.md)
