---
type: Proof Obligation
title: "Golden eval obligation — Run the Competitive Intelligence Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-competitive-intelligence-monitor-end-to-end"
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

# Golden eval obligation — Run the Competitive Intelligence Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [competitive-intelligence-monitor-end-to-end](/tests/competitive-intelligence-monitor-end-to-end.md)


## Mechanisms

- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_crayon_crayon_records](/tools/query-crayon-crayon-records.md)
- [query_google_news_api_google_news_api_records](/tools/query-google-news-api-google-news-api-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_competitive_intelligence_monitor_playbook](/tools/lookup-competitive-intelligence-monitor-playbook.md)
- [action_semrush_recommend](/tools/action-semrush-recommend.md)

## Entities that must be referenced

- keyword_rankings
- crayon_records
- google_news_api_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [competitive-intelligence-monitor-playbook](/documents/competitive-intelligence-monitor-playbook.md)
