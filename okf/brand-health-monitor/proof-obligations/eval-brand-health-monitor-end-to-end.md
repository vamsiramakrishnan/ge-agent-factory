---
type: Proof Obligation
title: "Golden eval obligation — Run the Brand Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-brand-health-monitor-end-to-end"
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

# Golden eval obligation — Run the Brand Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [brand-health-monitor-end-to-end](/tests/brand-health-monitor-end-to-end.md)


## Mechanisms

- [query_brandwatch_brand_mentions](/tools/query-brandwatch-brand-mentions.md)
- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_google_trends_google_trends_records](/tools/query-google-trends-google-trends-records.md)
- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [lookup_brand_health_monitor_playbook](/tools/lookup-brand-health-monitor-playbook.md)
- [action_brandwatch_recommend](/tools/action-brandwatch-recommend.md)

## Entities that must be referenced

- brand_mentions
- social_posts
- google_trends_records
- keyword_rankings
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [brand-health-monitor-playbook](/documents/brand-health-monitor-playbook.md)
