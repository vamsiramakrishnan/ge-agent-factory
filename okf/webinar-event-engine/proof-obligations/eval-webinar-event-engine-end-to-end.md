---
type: Proof Obligation
title: "Golden eval obligation — Run the Webinar & Event Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-webinar-event-engine-end-to-end"
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

# Golden eval obligation — Run the Webinar & Event Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [webinar-event-engine-end-to-end](/tests/webinar-event-engine-end-to-end.md)


## Mechanisms

- [query_zoom_zoom_records](/tools/query-zoom-zoom-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_google_calendar_events](/tools/query-google-calendar-events.md)
- [lookup_webinar_event_engine_playbook](/tools/lookup-webinar-event-engine-playbook.md)
- [action_zoom_generate](/tools/action-zoom-generate.md)

## Entities that must be referenced

- zoom_records
- contacts
- accounts
- events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [webinar-event-engine-playbook](/documents/webinar-event-engine-playbook.md)
