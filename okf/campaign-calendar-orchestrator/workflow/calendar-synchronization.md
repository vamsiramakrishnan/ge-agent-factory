---
type: Workflow Stage
title: Calendar Synchronization
description: "Sync campaigns from HubSpot with Asana timelines and Google Calendar. Detect scheduling conflicts and cross-campaign dependencies."
source_id: calendar_synchronization
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Calendar Synchronization

Sync campaigns from HubSpot with Asana timelines and Google Calendar. Detect scheduling conflicts and cross-campaign dependencies.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_asana_asana_records](/tools/query-asana-asana-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_google_calendar_events](/tools/query-google-calendar-events.md)
- [lookup_campaign_calendar_orchestrator_playbook](/tools/lookup-campaign-calendar-orchestrator-playbook.md)
- [action_asana_recommend](/tools/action-asana-recommend.md)

Next: [Overlap & Conflict Analysis](/workflow/overlap-conflict-analysis.md)
