---
type: Eval Scenario
title: "Run the Social Listening & Sentiment Analyzer workflow for the current period..."
description: "Run the Social Listening & Sentiment Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "social-listening-sentiment-analyzer-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Social Listening & Sentiment Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [social-mention-aggregation](/queries/social-mention-aggregation.md)

## Mechanisms to call

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_brandwatch_brand_mentions](/tools/query-brandwatch-brand-mentions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_social_listening_sentiment_analyzer_playbook](/tools/lookup-social-listening-sentiment-analyzer-playbook.md)
- [action_sprout_social_recommend](/tools/action-sprout-social-recommend.md)

## Success rubric

Action recommend executed against Sprout Social, with audit-trail entry and Social Media Mgr notified of outcomes.

# Citations

- [Social Listening & Sentiment Analyzer Playbook](/documents/social-listening-sentiment-analyzer-playbook.md)
