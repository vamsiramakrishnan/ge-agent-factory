---
type: Eval Scenario
title: Run the Brand Health Monitor workflow for the current period. Cite the releva...
description: "Run the Brand Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "brand-health-monitor-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Brand Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [signal-aggregation](/queries/signal-aggregation.md)

## Mechanisms to call

- [query_brandwatch_brand_mentions](/tools/query-brandwatch-brand-mentions.md)
- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_google_trends_google_trends_records](/tools/query-google-trends-google-trends-records.md)
- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [lookup_brand_health_monitor_playbook](/tools/lookup-brand-health-monitor-playbook.md)
- [action_brandwatch_recommend](/tools/action-brandwatch-recommend.md)

## Success rubric

Action recommend executed against Brandwatch, with audit-trail entry and Brand Manager notified of outcomes.

# Citations

- [Brand Health Monitor Playbook](/documents/brand-health-monitor-playbook.md)
