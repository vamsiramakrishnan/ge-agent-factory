---
type: Query Capability
title: Receive social mentions and DMs from Sprout Social and Hootsuite. Classify by...
description: "Receive social mentions and DMs from Sprout Social and Hootsuite. Classify by intent — support request, sales inquiry, product feedback, or engagement opportunity. Check customer value in Salesforce CRM."
source_id: "mention-intake-classification"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive social mentions and DMs from Sprout Social and Hootsuite. Classify by intent — support request, sales inquiry, product feedback, or engagement opportunity. Check customer value in Salesforce CRM.

## Tools used

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_hootsuite_social_posts](/tools/query-hootsuite-social-posts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_community_engagement_responder_playbook](/tools/lookup-community-engagement-responder-playbook.md)
- [action_sprout_social_route](/tools/action-sprout-social-route.md)

## Runs in

- [mention_intake_classification](/workflow/mention-intake-classification.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Community Engagement Responder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/community-engagement-responder-end-to-end.md)

# Citations

- [Community Engagement Responder Playbook](/documents/community-engagement-responder-playbook.md)
