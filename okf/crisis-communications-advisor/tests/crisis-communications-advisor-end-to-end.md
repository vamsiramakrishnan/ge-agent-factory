---
type: Eval Scenario
title: Run the Crisis Communications Advisor workflow for the current period. Cite t...
description: "Run the Crisis Communications Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "crisis-communications-advisor-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Crisis Communications Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [signal-detection](/queries/signal-detection.md)

## Mechanisms to call

- [query_brandwatch_brand_mentions](/tools/query-brandwatch-brand-mentions.md)
- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_google_news_api_google_news_api_records](/tools/query-google-news-api-google-news-api-records.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_crisis_communications_advisor_playbook](/tools/lookup-crisis-communications-advisor-playbook.md)
- [action_brandwatch_generate](/tools/action-brandwatch-generate.md)

## Success rubric

Action generate executed against Brandwatch, with audit-trail entry and CMO notified of outcomes.

# Citations

- [Crisis Communications Advisor Playbook](/documents/crisis-communications-advisor-playbook.md)
