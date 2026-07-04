---
type: Query Capability
title: Sentiment spike alerts via Slack immediately. Daily listening digest with sha...
description: "Sentiment spike alerts via Slack immediately. Daily listening digest with share of voice, emerging topics, and recommended actions distributed to social and brand teams."
source_id: "alert-distribution"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Sentiment spike alerts via Slack immediately. Daily listening digest with share of voice, emerging topics, and recommended actions distributed to social and brand teams.

## Tools used

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_brandwatch_brand_mentions](/tools/query-brandwatch-brand-mentions.md)
- [lookup_social_listening_sentiment_analyzer_playbook](/tools/lookup-social-listening-sentiment-analyzer-playbook.md)
- [action_sprout_social_recommend](/tools/action-sprout-social-recommend.md)

## Runs in

- [alert_distribution](/workflow/alert-distribution.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Social Listening & Sentiment Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/social-listening-sentiment-analyzer-end-to-end.md)

# Citations

- [Social Listening & Sentiment Analyzer Playbook](/documents/social-listening-sentiment-analyzer-playbook.md)
