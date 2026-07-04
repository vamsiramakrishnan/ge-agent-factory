---
type: Eval Scenario
title: "Run the Webinar & Event Engine workflow for the current period. Cite the rele..."
description: "Run the Webinar & Event Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "webinar-event-engine-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Webinar & Event Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [event-configuration](/queries/event-configuration.md)

## Mechanisms to call

- [query_zoom_zoom_records](/tools/query-zoom-zoom-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_google_calendar_events](/tools/query-google-calendar-events.md)
- [lookup_webinar_event_engine_playbook](/tools/lookup-webinar-event-engine-playbook.md)
- [action_zoom_generate](/tools/action-zoom-generate.md)

## Success rubric

Action generate executed against Zoom, with audit-trail entry and Demand Gen Manager notified of outcomes.

# Citations

- [Webinar & Event Engine Playbook](/documents/webinar-event-engine-playbook.md)
