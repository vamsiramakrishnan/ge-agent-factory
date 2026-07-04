---
type: Query Capability
title: "Trigger follow-up workflows in HubSpot. Send recording to no-shows. Route hig..."
description: "Trigger follow-up workflows in HubSpot. Send recording to no-shows. Route high-intent attendees to sales. Update Salesforce campaign with attendance data."
source_id: "post-event-orchestration"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Trigger follow-up workflows in HubSpot. Send recording to no-shows. Route high-intent attendees to sales. Update Salesforce campaign with attendance data.

## Tools used

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_webinar_event_engine_playbook](/tools/lookup-webinar-event-engine-playbook.md)

## Runs in

- [post_event_orchestration](/workflow/post-event-orchestration.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Webinar & Event Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/webinar-event-engine-end-to-end.md)

# Citations

- [Webinar & Event Engine Playbook](/documents/webinar-event-engine-playbook.md)
