---
type: Proof Obligation
title: "Golden eval obligation — Run the Engineering Change Backlog Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-engineering-change-backlog-analyzer-end-to-end"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Engineering Change Backlog Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [engineering-change-backlog-analyzer-end-to-end](/tests/engineering-change-backlog-analyzer-end-to-end.md)


## Mechanisms

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_engineering_change_backlog_analyzer_sop](/tools/lookup-engineering-change-backlog-analyzer-sop.md)
- [action_ptc_windchill_plm_draft](/tools/action-ptc-windchill-plm-draft.md)

## Entities that must be referenced

- engineering_change_orders
- issues
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute draft without two-system evidence

# Citations

- [engineering-change-backlog-analyzer-sop](/documents/engineering-change-backlog-analyzer-sop.md)
