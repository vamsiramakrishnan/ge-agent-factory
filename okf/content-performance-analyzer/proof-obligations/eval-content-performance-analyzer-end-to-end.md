---
type: Proof Obligation
title: "Golden eval obligation — Run the Content Performance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-content-performance-analyzer-end-to-end"
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

# Golden eval obligation — Run the Content Performance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [content-performance-analyzer-end-to-end](/tests/content-performance-analyzer-end-to-end.md)


## Mechanisms

- [query_google_analytics_4_session_events](/tools/query-google-analytics-4-session-events.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_content_performance_analyzer_playbook](/tools/lookup-content-performance-analyzer-playbook.md)
- [action_hubspot_recommend](/tools/action-hubspot-recommend.md)

## Entities that must be referenced

- session_events
- contacts
- keyword_rankings
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [content-performance-analyzer-playbook](/documents/content-performance-analyzer-playbook.md)
