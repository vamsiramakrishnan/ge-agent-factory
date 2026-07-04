---
type: Query Capability
title: "Pull stage-by-stage conversion data from Salesforce CRM (pipeline stages) and..."
description: "Pull stage-by-stage conversion data from Salesforce CRM (pipeline stages) and HubSpot (marketing stages). Calculate velocity metrics per stage with cohort breakdowns."
source_id: "funnel-data-extraction"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull stage-by-stage conversion data from Salesforce CRM (pipeline stages) and HubSpot (marketing stages). Calculate velocity metrics per stage with cohort breakdowns.

## Tools used

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_funnel_velocity_analyzer_playbook](/tools/lookup-funnel-velocity-analyzer-playbook.md)

## Runs in

- [funnel_data_extraction](/workflow/funnel-data-extraction.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Funnel Velocity Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/funnel-velocity-analyzer-end-to-end.md)

# Citations

- [Funnel Velocity Analyzer Playbook](/documents/funnel-velocity-analyzer-playbook.md)
