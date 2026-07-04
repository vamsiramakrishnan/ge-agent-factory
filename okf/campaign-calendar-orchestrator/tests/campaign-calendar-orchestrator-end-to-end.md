---
type: Eval Scenario
title: Run the Campaign Calendar Orchestrator workflow for the current period. Cite ...
description: "Run the Campaign Calendar Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "campaign-calendar-orchestrator-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Campaign Calendar Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [calendar-synchronization](/queries/calendar-synchronization.md)

## Mechanisms to call

- [query_asana_asana_records](/tools/query-asana-asana-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_google_calendar_events](/tools/query-google-calendar-events.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_campaign_calendar_orchestrator_playbook](/tools/lookup-campaign-calendar-orchestrator-playbook.md)
- [action_asana_recommend](/tools/action-asana-recommend.md)

## Success rubric

Action recommend executed against Asana, with audit-trail entry and VP Marketing notified of outcomes.

# Citations

- [Campaign Calendar Orchestrator Playbook](/documents/campaign-calendar-orchestrator-playbook.md)
