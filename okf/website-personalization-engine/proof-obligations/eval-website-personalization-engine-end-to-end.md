---
type: Proof Obligation
title: "Golden eval obligation — Run the Website Personalization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-website-personalization-engine-end-to-end"
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

# Golden eval obligation — Run the Website Personalization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [website-personalization-engine-end-to-end](/tests/website-personalization-engine-end-to-end.md)


## Mechanisms

- [query_google_optimize_google_optimize_records](/tools/query-google-optimize-google-optimize-records.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_website_personalization_engine_playbook](/tools/lookup-website-personalization-engine-playbook.md)
- [action_google_optimize_match](/tools/action-google-optimize-match.md)

## Entities that must be referenced

- google_optimize_records
- session_events
- accounts
- contacts

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute match without two-system evidence

# Citations

- [website-personalization-engine-playbook](/documents/website-personalization-engine-playbook.md)
