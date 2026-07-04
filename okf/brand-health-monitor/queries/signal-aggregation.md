---
type: Query Capability
title: "Pull brand mentions from Brandwatch, social metrics from Sprout Social, searc..."
description: "Pull brand mentions from Brandwatch, social metrics from Sprout Social, search interest from Google Trends, and competitive data from SEMrush into unified dataset."
source_id: "signal-aggregation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull brand mentions from Brandwatch, social metrics from Sprout Social, search interest from Google Trends, and competitive data from SEMrush into unified dataset.

## Tools used

- [query_brandwatch_brand_mentions](/tools/query-brandwatch-brand-mentions.md)
- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_google_trends_google_trends_records](/tools/query-google-trends-google-trends-records.md)
- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [lookup_brand_health_monitor_playbook](/tools/lookup-brand-health-monitor-playbook.md)
- [action_brandwatch_recommend](/tools/action-brandwatch-recommend.md)

## Runs in

- [signal_aggregation](/workflow/signal-aggregation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Brand Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/brand-health-monitor-end-to-end.md)

# Citations

- [Brand Health Monitor Playbook](/documents/brand-health-monitor-playbook.md)
