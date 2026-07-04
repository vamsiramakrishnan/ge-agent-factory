---
type: Proof Obligation
title: "Golden eval obligation — Run the Landing Page Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-landing-page-optimizer-end-to-end"
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

# Golden eval obligation — Run the Landing Page Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [landing-page-optimizer-end-to-end](/tests/landing-page-optimizer-end-to-end.md)


## Mechanisms

- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [query_unbounce_unbounce_records](/tools/query-unbounce-unbounce-records.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_landing_page_optimizer_playbook](/tools/lookup-landing-page-optimizer-playbook.md)
- [action_wordpress_recommend](/tools/action-wordpress-recommend.md)

## Entities that must be referenced

- content_entries
- unbounce_records
- session_events
- contacts
- google_optimize_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [landing-page-optimizer-playbook](/documents/landing-page-optimizer-playbook.md)
