---
type: Eval Scenario
title: Run the Community Engagement Responder workflow for the current period. Cite ...
description: "Run the Community Engagement Responder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "community-engagement-responder-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Community Engagement Responder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [mention-intake-classification](/queries/mention-intake-classification.md)

## Mechanisms to call

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_hootsuite_social_posts](/tools/query-hootsuite-social-posts.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_community_engagement_responder_playbook](/tools/lookup-community-engagement-responder-playbook.md)
- [action_sprout_social_route](/tools/action-sprout-social-route.md)

## Success rubric

Action route executed against Sprout Social, with audit-trail entry and Social Media Mgr notified of outcomes.

# Citations

- [Community Engagement Responder Playbook](/documents/community-engagement-responder-playbook.md)
