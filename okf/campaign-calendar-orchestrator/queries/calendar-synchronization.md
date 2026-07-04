---
type: Query Capability
title: Sync campaigns from HubSpot with Asana timelines and Google Calendar. Detect ...
description: "Sync campaigns from HubSpot with Asana timelines and Google Calendar. Detect scheduling conflicts and cross-campaign dependencies."
source_id: "calendar-synchronization"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Sync campaigns from HubSpot with Asana timelines and Google Calendar. Detect scheduling conflicts and cross-campaign dependencies.

## Tools used

- [query_asana_asana_records](/tools/query-asana-asana-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_google_calendar_events](/tools/query-google-calendar-events.md)
- [lookup_campaign_calendar_orchestrator_playbook](/tools/lookup-campaign-calendar-orchestrator-playbook.md)
- [action_asana_recommend](/tools/action-asana-recommend.md)

## Runs in

- [calendar_synchronization](/workflow/calendar-synchronization.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Campaign Calendar Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/campaign-calendar-orchestrator-end-to-end.md)

# Citations

- [Campaign Calendar Orchestrator Playbook](/documents/campaign-calendar-orchestrator-playbook.md)
