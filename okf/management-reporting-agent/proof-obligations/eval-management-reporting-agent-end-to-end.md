---
type: Proof Obligation
title: "Golden eval obligation — Run the Management Reporting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-management-reporting-agent-end-to-end"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Management Reporting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [management-reporting-agent-end-to-end](/tests/management-reporting-agent-end-to-end.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_google_slides_presentations](/tools/query-google-slides-presentations.md)
- [lookup_management_reporting_agent_controls_playbook](/tools/lookup-management-reporting-agent-controls-playbook.md)
- [action_google_slides_recommend](/tools/action-google-slides-recommend.md)

## Entities that must be referenced

- analytics_events
- dashboards
- presentations

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [management-reporting-agent-controls-playbook](/documents/management-reporting-agent-controls-playbook.md)
