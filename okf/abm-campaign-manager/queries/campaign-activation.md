---
type: Query Capability
title: Create personalized ad campaigns in LinkedIn. Coordinate email and content to...
description: Create personalized ad campaigns in LinkedIn. Coordinate email and content touches in HubSpot. Update account engagement scores in Salesforce.
source_id: "campaign-activation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Create personalized ad campaigns in LinkedIn. Coordinate email and content touches in HubSpot. Update account engagement scores in Salesforce.

## Tools used

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_abm_campaign_manager_playbook](/tools/lookup-abm-campaign-manager-playbook.md)

## Runs in

- [campaign_activation](/workflow/campaign-activation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the ABM Campaign Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/abm-campaign-manager-end-to-end.md)

# Citations

- [ABM Campaign Manager Playbook](/documents/abm-campaign-manager-playbook.md)
