---
type: Proof Obligation
title: "Golden eval obligation — Run the Campaign Calendar Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-campaign-calendar-orchestrator-end-to-end"
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

# Golden eval obligation — Run the Campaign Calendar Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [campaign-calendar-orchestrator-end-to-end](/tests/campaign-calendar-orchestrator-end-to-end.md)


## Mechanisms

- [query_asana_asana_records](/tools/query-asana-asana-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_google_calendar_events](/tools/query-google-calendar-events.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_campaign_calendar_orchestrator_playbook](/tools/lookup-campaign-calendar-orchestrator-playbook.md)
- [action_asana_recommend](/tools/action-asana-recommend.md)

## Entities that must be referenced

- asana_records
- contacts
- events
- accounts
- messages

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [campaign-calendar-orchestrator-playbook](/documents/campaign-calendar-orchestrator-playbook.md)
