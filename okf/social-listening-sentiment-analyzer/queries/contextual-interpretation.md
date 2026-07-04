---
type: Query Capability
title: "Gemini interprets nuance in social conversations — sarcasm, implied criticism..."
description: "Gemini interprets nuance in social conversations — sarcasm, implied criticism, cultural context. 'A thread with 50+ replies criticizing our ad isn't a crisis — it's engagement bait from a competitor's community manager. Genuine customer sentiment is positive.'"
source_id: "contextual-interpretation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini interprets nuance in social conversations — sarcasm, implied criticism, cultural context. 'A thread with 50+ replies criticizing our ad isn't a crisis — it's engagement bait from a competitor's community manager. Genuine customer sentiment is positive.'

## Tools used

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [lookup_social_listening_sentiment_analyzer_playbook](/tools/lookup-social-listening-sentiment-analyzer-playbook.md)
- [action_sprout_social_recommend](/tools/action-sprout-social-recommend.md)

## Runs in

- [contextual_interpretation](/workflow/contextual-interpretation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Social Listening & Sentiment Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/social-listening-sentiment-analyzer-end-to-end.md)

# Citations

- [Social Listening & Sentiment Analyzer Playbook](/documents/social-listening-sentiment-analyzer-playbook.md)
