---
type: Proof Obligation
title: "Golden eval obligation — Run the Social Listening & Sentiment Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-social-listening-sentiment-analyzer-end-to-end"
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

# Golden eval obligation — Run the Social Listening & Sentiment Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [social-listening-sentiment-analyzer-end-to-end](/tests/social-listening-sentiment-analyzer-end-to-end.md)


## Mechanisms

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_brandwatch_brand_mentions](/tools/query-brandwatch-brand-mentions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_social_listening_sentiment_analyzer_playbook](/tools/lookup-social-listening-sentiment-analyzer-playbook.md)
- [action_sprout_social_recommend](/tools/action-sprout-social-recommend.md)

## Entities that must be referenced

- social_posts
- brand_mentions
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [social-listening-sentiment-analyzer-playbook](/documents/social-listening-sentiment-analyzer-playbook.md)
