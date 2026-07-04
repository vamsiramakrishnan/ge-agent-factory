---
type: Proof Obligation
title: "Golden eval obligation — Run the Social Media Analytics Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-social-media-analytics-dashboard-end-to-end"
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

# Golden eval obligation — Run the Social Media Analytics Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [social-media-analytics-dashboard-end-to-end](/tests/social-media-analytics-dashboard-end-to-end.md)


## Mechanisms

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_hootsuite_social_posts](/tools/query-hootsuite-social-posts.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_social_media_analytics_dashboard_playbook](/tools/lookup-social-media-analytics-dashboard-playbook.md)
- [action_sprout_social_recommend](/tools/action-sprout-social-recommend.md)

## Entities that must be referenced

- social_posts
- social_posts
- session_events
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [social-media-analytics-dashboard-playbook](/documents/social-media-analytics-dashboard-playbook.md)
