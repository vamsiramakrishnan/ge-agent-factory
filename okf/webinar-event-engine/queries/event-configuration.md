---
type: Query Capability
title: Create webinar in Zoom. Set up registration in HubSpot. Build email promotion...
description: Create webinar in Zoom. Set up registration in HubSpot. Build email promotion sequences. Configure reminder cadence. Sync registrants to Salesforce campaign.
source_id: "event-configuration"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Create webinar in Zoom. Set up registration in HubSpot. Build email promotion sequences. Configure reminder cadence. Sync registrants to Salesforce campaign.

## Tools used

- [query_zoom_zoom_records](/tools/query-zoom-zoom-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_webinar_event_engine_playbook](/tools/lookup-webinar-event-engine-playbook.md)
- [action_zoom_generate](/tools/action-zoom-generate.md)

## Runs in

- [event_configuration](/workflow/event-configuration.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Webinar & Event Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/webinar-event-engine-end-to-end.md)

# Citations

- [Webinar & Event Engine Playbook](/documents/webinar-event-engine-playbook.md)
