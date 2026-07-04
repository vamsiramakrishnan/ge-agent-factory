---
type: Proof Obligation
title: "Golden eval obligation — Run the Social Content Calendar Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-social-content-calendar-manager-end-to-end"
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

# Golden eval obligation — Run the Social Content Calendar Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [social-content-calendar-manager-end-to-end](/tests/social-content-calendar-manager-end-to-end.md)


## Mechanisms

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_hootsuite_social_posts](/tools/query-hootsuite-social-posts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_canva_assets](/tools/query-canva-assets.md)
- [lookup_social_content_calendar_manager_playbook](/tools/lookup-social-content-calendar-manager-playbook.md)
- [action_sprout_social_generate](/tools/action-sprout-social-generate.md)

## Entities that must be referenced

- social_posts
- social_posts
- contacts
- assets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [social-content-calendar-manager-playbook](/documents/social-content-calendar-manager-playbook.md)
