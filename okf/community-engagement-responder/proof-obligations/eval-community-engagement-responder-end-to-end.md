---
type: Proof Obligation
title: "Golden eval obligation — Run the Community Engagement Responder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-community-engagement-responder-end-to-end"
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

# Golden eval obligation — Run the Community Engagement Responder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [community-engagement-responder-end-to-end](/tests/community-engagement-responder-end-to-end.md)


## Mechanisms

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_hootsuite_social_posts](/tools/query-hootsuite-social-posts.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_community_engagement_responder_playbook](/tools/lookup-community-engagement-responder-playbook.md)
- [action_sprout_social_route](/tools/action-sprout-social-route.md)

## Entities that must be referenced

- social_posts
- social_posts
- tickets
- accounts

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute route without two-system evidence

# Citations

- [community-engagement-responder-playbook](/documents/community-engagement-responder-playbook.md)
