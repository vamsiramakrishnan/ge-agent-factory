---
type: Workflow Stage
title: Signal Detection
description: "Monitor for crisis signals: sudden sentiment drops (>15% in 2 hours), media inquiry spikes, viral negative content, or executive mention anomalies across Brandwatch and Sprout Social."
source_id: signal_detection
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Signal Detection

Monitor for crisis signals: sudden sentiment drops (>15% in 2 hours), media inquiry spikes, viral negative content, or executive mention anomalies across Brandwatch and Sprout Social.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_brandwatch_brand_mentions](/tools/query-brandwatch-brand-mentions.md)
- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [lookup_crisis_communications_advisor_playbook](/tools/lookup-crisis-communications-advisor-playbook.md)
- [action_brandwatch_generate](/tools/action-brandwatch-generate.md)

Next: [Severity Scoring](/workflow/severity-scoring.md)
