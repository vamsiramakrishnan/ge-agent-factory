---
type: Query Capability
title: "Standard responses queued for auto-publish. Escalations and sensitive respons..."
description: "Standard responses queued for auto-publish. Escalations and sensitive responses routed to Social Media Manager for review. Support issues create Zendesk tickets."
source_id: "publishing-escalation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Standard responses queued for auto-publish. Escalations and sensitive responses routed to Social Media Manager for review. Support issues create Zendesk tickets.

## Tools used

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_hootsuite_social_posts](/tools/query-hootsuite-social-posts.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_community_engagement_responder_playbook](/tools/lookup-community-engagement-responder-playbook.md)
- [action_sprout_social_route](/tools/action-sprout-social-route.md)

## Runs in

- [publishing_escalation](/workflow/publishing-escalation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Community Engagement Responder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/community-engagement-responder-end-to-end.md)

# Citations

- [Community Engagement Responder Playbook](/documents/community-engagement-responder-playbook.md)
