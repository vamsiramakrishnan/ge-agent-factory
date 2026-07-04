---
type: Query Capability
title: "Pull brand mentions, competitor mentions, and industry conversations from Spr..."
description: "Pull brand mentions, competitor mentions, and industry conversations from Sprout Social and Brandwatch. Aggregate in BigQuery with timestamp and source metadata."
source_id: "social-mention-aggregation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull brand mentions, competitor mentions, and industry conversations from Sprout Social and Brandwatch. Aggregate in BigQuery with timestamp and source metadata.

## Tools used

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_brandwatch_brand_mentions](/tools/query-brandwatch-brand-mentions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_social_listening_sentiment_analyzer_playbook](/tools/lookup-social-listening-sentiment-analyzer-playbook.md)
- [action_sprout_social_recommend](/tools/action-sprout-social-recommend.md)

## Runs in

- [social_mention_aggregation](/workflow/social-mention-aggregation.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Social Listening & Sentiment Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/social-listening-sentiment-analyzer-end-to-end.md)

# Citations

- [Social Listening & Sentiment Analyzer Playbook](/documents/social-listening-sentiment-analyzer-playbook.md)
