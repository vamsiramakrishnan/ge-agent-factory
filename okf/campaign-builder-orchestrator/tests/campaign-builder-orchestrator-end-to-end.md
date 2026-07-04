---
type: Eval Scenario
title: "Run the Campaign Builder & Orchestrator workflow for the current period. Cite..."
description: "Run the Campaign Builder & Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "campaign-builder-orchestrator-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Campaign Builder & Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [campaign-setup](/queries/campaign-setup.md)

## Mechanisms to call

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_marketo_campaigns](/tools/query-marketo-campaigns.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_campaign_builder_orchestrator_playbook](/tools/lookup-campaign-builder-orchestrator-playbook.md)
- [action_hubspot_draft](/tools/action-hubspot-draft.md)

## Success rubric

Action draft executed against HubSpot, with audit-trail entry and Demand Gen Manager notified of outcomes.

# Citations

- [Campaign Builder & Orchestrator Playbook](/documents/campaign-builder-orchestrator-playbook.md)
