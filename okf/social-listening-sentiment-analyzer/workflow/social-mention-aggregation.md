---
type: Workflow Stage
title: Social Mention Aggregation
description: "Pull brand mentions, competitor mentions, and industry conversations from Sprout Social and Brandwatch. Aggregate in BigQuery with timestamp and source metadata."
source_id: social_mention_aggregation
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Social Mention Aggregation

Pull brand mentions, competitor mentions, and industry conversations from Sprout Social and Brandwatch. Aggregate in BigQuery with timestamp and source metadata.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_brandwatch_brand_mentions](/tools/query-brandwatch-brand-mentions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_social_listening_sentiment_analyzer_playbook](/tools/lookup-social-listening-sentiment-analyzer-playbook.md)
- [action_sprout_social_recommend](/tools/action-sprout-social-recommend.md)

Next: [Quantitative Sentiment Analysis](/workflow/quantitative-sentiment-analysis.md)
