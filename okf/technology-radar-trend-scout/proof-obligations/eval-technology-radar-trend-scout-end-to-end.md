---
type: Proof Obligation
title: "Golden eval obligation — Run the Technology Radar & Trend Scout workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-technology-radar-trend-scout-end-to-end"
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

# Golden eval obligation — Run the Technology Radar & Trend Scout workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [technology-radar-trend-scout-end-to-end](/tests/technology-radar-trend-scout-end-to-end.md)


## Mechanisms

- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_gartner_api_gartner_api_records](/tools/query-gartner-api-gartner-api-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_technology_radar_trend_scout_runbook](/tools/lookup-technology-radar-trend-scout-runbook.md)
- [action_github_update](/tools/action-github-update.md)

## Entities that must be referenced

- pull_requests
- gartner_api_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute update without two-system evidence

# Citations

- [technology-radar-trend-scout-runbook](/documents/technology-radar-trend-scout-runbook.md)
