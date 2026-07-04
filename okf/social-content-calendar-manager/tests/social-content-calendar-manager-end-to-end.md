---
type: Eval Scenario
title: Run the Social Content Calendar Manager workflow for the current period. Cite...
description: "Run the Social Content Calendar Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "social-content-calendar-manager-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Social Content Calendar Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [platform-adapted-content](/queries/platform-adapted-content.md)

## Mechanisms to call

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_hootsuite_social_posts](/tools/query-hootsuite-social-posts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_canva_assets](/tools/query-canva-assets.md)
- [lookup_social_content_calendar_manager_playbook](/tools/lookup-social-content-calendar-manager-playbook.md)
- [action_sprout_social_generate](/tools/action-sprout-social-generate.md)

## Success rubric

Action generate executed against Sprout Social, with audit-trail entry and Social Media Mgr notified of outcomes.

# Citations

- [Social Content Calendar Manager Playbook](/documents/social-content-calendar-manager-playbook.md)
