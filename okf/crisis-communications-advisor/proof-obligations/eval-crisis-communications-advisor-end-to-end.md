---
type: Proof Obligation
title: "Golden eval obligation — Run the Crisis Communications Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-crisis-communications-advisor-end-to-end"
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

# Golden eval obligation — Run the Crisis Communications Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [crisis-communications-advisor-end-to-end](/tests/crisis-communications-advisor-end-to-end.md)


## Mechanisms

- [query_brandwatch_brand_mentions](/tools/query-brandwatch-brand-mentions.md)
- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_google_news_api_google_news_api_records](/tools/query-google-news-api-google-news-api-records.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_crisis_communications_advisor_playbook](/tools/lookup-crisis-communications-advisor-playbook.md)
- [action_brandwatch_generate](/tools/action-brandwatch-generate.md)

## Entities that must be referenced

- brand_mentions
- social_posts
- google_news_api_records
- messages

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [crisis-communications-advisor-playbook](/documents/crisis-communications-advisor-playbook.md)
