---
type: Proof Obligation
title: "Golden eval obligation — Run the Marketing OKR Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-marketing-okr-tracker-end-to-end"
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

# Golden eval obligation — Run the Marketing OKR Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [marketing-okr-tracker-end-to-end](/tests/marketing-okr-tracker-end-to-end.md)


## Mechanisms

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_google_analytics_4_session_events](/tools/query-google-analytics-4-session-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_marketing_okr_tracker_playbook](/tools/lookup-marketing-okr-tracker-playbook.md)
- [action_salesforce_crm_recommend](/tools/action-salesforce-crm-recommend.md)

## Entities that must be referenced

- accounts
- contacts
- session_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [marketing-okr-tracker-playbook](/documents/marketing-okr-tracker-playbook.md)
